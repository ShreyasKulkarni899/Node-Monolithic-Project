const db = require("../../common/models/dbSchema.js");
const purchaseSchema = require("../models/purchaseSchema.js");
const inventoryProduct = require("../../inventory/models/inventorySchema.js");
const generalLib = require("../../common/Lib/generalLib");
const employeeIncentive = require("../../common/incentive/models/incentiveSchema.js")
    //const productParameterSchema = require("../../parameter/models/productParameterSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
    DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
    createLog,
} = require("../../common/Logger/controller/LoggerController.js");

exports.test = async(req, res) => {
    //console.log(req.body);
    res.json(req.body);
};

exports.addPurchase = async(req, res) => {
    DATA_BLOCK.endpoint = "/purchase/";
    DATA_BLOCK.method = "POST";
    // Validation Module
    const validationResult = require("../util/purchaseValidator.js");
    if (!validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        console.log("Validation Error!");
    } else {
        reqData = req.body;
        // Creating new Purchase Model
        var newPurchase = new purchaseSchema(reqData);
        newPurchase.save().then((savedObj) => {
            DATA_BLOCK.status = "OK";
            createLog(DATA_BLOCK);
            //console.log("Saved New Purchase Objects", savedObj);
            // Initializing Variables
            var purchaseId = savedObj._id;
            var products = reqData.products;
            delete reqData.products;
            // Required Products Stores all products and varients seperately
            const requiredProducts = [];
            const storeName = reqData.storeName;
            const storeId = reqData.storeId;
            const supplierId = reqData.supplierId;

            // Iterating Over Products and Varients
            for (const temp of products) {
                const varients = temp.varients;
                delete temp.varients;
                for (const tempvar of varients) {
                    const tempProduct = {...temp, ...tempvar };
                    tempProduct["storeName"] = storeName;
                    tempProduct["purchaseId"] = purchaseId;
                    temp["storeId"] = storeId;
                    temp["supplierId"] = supplierId;
                    requiredProducts.push(tempProduct);
                }
            }

            savedObj.totalProducts = requiredProducts.length ? requiredProducts.length : 0;
            purchaseSchema.findByIdAndUpdate(savedObj._id, savedObj).catch(() => {
                console.log("Error While Updating Total Products");
            })

            //console.log("Required Products(Products and respective varients)", requiredProducts);

            Promise.all(
                requiredProducts.map(async(product) => {
                    try {
                        // Saving Product Into Inventory
                        const savedProduct = await generalLib.saveProductToInvetory(
                            product
                        );
                        return savedProduct;
                    } catch (err) {
                        console.log(
                            "Failed to save products into inventory!, Error:",
                            err.message
                        );
                    }
                })
            ).then(async(result) => {
                // Result -> Object with added discount and allocation
                // Calulating Incentives For Sorter and Labeler
                try {
                    await generalLib
                        .calculateIncentiveForPurchase(
                            requiredProducts,
                            reqData.sortedById,
                            reqData.labeledBy
                        )
                        .then((amount) => {
                            //console.log("Incentive Amounts", amount, "Result", result);
                            for (const res of result) {
                                // Queries to log employee incentive data
                                var addQuerySorter = {
                                    purchaseId: purchaseId,
                                    employeeId: reqData.sortedById,
                                    workType: "sorter",
                                };
                                var addQueryLabeler = {
                                    purchaseId: purchaseId,
                                    employeeId: reqData.labeledBy.userId,
                                    workType: "labeler",
                                };

                                if (reqData.sortedById) {
                                    // Sorter
                                    addQuerySorter["incentiveAmount"] = amount[0];
                                    generalLib.addIncentive(addQuerySorter);
                                    var incentiveObjSorter = {
                                        workType: "sorter",
                                        specification: "sorter",
                                        incentiveCalculationType: "Fixed",
                                        incentive: amount[0],
                                    };
                                }
                                if (reqData.labeledBy) {
                                    // Labeler
                                    addQueryLabeler["incentiveAmount"] = amount[1];
                                    const labeledByHere = reqData.labeledBy;
                                    labeledByHere.forEach((labeler) => {
                                        addQueryLabeler.employeeId = labeler.userId;
                                        generalLib.addIncentive(addQueryLabeler);
                                    });
                                    var incentiveObjLabeler = {
                                        workType: "labeler",
                                        specification: "labeler",
                                        incentiveCalculationType: "Fixed",
                                        incentive: amount[1],
                                    };
                                }

                                // Adding incentive data to inventory products
                                res.incentives[0] = incentiveObjSorter ?
                                    incentiveObjSorter :
                                    null;
                                res.incentives[1] = incentiveObjLabeler ?
                                    incentiveObjLabeler :
                                    null;

                                //stockLocation: { store: 0, transientState: 0, warehouse: 0 },
                                res.stockLocation.warehouse = res.quantity;
                                // Updating data
                                inventoryProduct
                                    .findByIdAndUpdate(res._id, res, { useFindAndModify: false })
                                    .then((finalResult) => {
                                        //console.log("Purchase Added Successfully!");
                                    })
                                    .catch((err) => {
                                        DATA_BLOCK.status = "FAILED ";
                                        createLog(DATA_BLOCK);
                                        console.log(
                                            "Failed to update incentive data in inventory products!, Error:",
                                            err.message
                                        );
                                    });
                            }
                        });
                } catch {
                    (err) => {
                        console.log(err, "Here eerr")
                    }
                }
                var resMsg = {...savedObj.toObject(), ... { products: result } };
                resMsg
                    ?
                    res.json(resMsg) :
                    res.json({ message: "Something Went Wrong!" });
            });
        });
    }
};

exports.getPurchase = async(req, res) => {
    reqData = req.body;
    var page = req.query.page;
    var limit = req.query.limit;
    try {
        var query1 = {
            _id: reqData._id,
        };
        purchaseSchema.paginate({}, { "page": page || 1, "limit": limit || 10 })
            // purchaseSchema
            //     .find(query1)
            .then((result1) => {
                // console.log('A', result1);

                // query = {
                //     purchaseId: reqData._id,
                // };
                // var result = result1.docs[0];
                // // result["products"] = {};
                // // console.log('B', result);

                // inventoryProduct
                //     .find(query)
                //     .then((result2) => {
                //         console.log("C", result, typeof(result));
                //         var x = {...result.toObject(), products: result2 };

                //         // console.log("result : ", x);
                //         res.json(x);
                //     })
                //     .catch((err) => {
                //         console.log("err", err);
                //         res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                //             status: "NOK",
                //             code: responseCodes.INTERNAL_SERVER_ERROR,
                //             message: messages.SOMETHING_WENT_WRONG,
                //         });
                //     });
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "Successful",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.DATA_FETCHED,
                    data: result1,
                });
            })
            .catch((err) => {
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "NOK",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG,
                });
            });
    } catch (e) {
        console.log("error : " + e);
        return res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "NOK",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
        });
    }
};

exports.updatePurchase = async(req, res) => {
    DATA_BLOCK.endpoint = "/purchase/" + String(req.params.id);
    DATA_BLOCK.method = "PUT";
    const validationResult = require("../util/purchaseValidator.js");
    if (!validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        console.log("Validation Error!");
    } else {
        reqData = req.body;
        // Creating new Purchase Model
        purchaseSchema.findOneAndUpdate({ _id: reqData._id }, reqData, { upsert: false, new: true })
            .then((savedObj) => {
                console.log("SavedOBJ", savedObj);
                if (savedObj) {
                    DATA_BLOCK.status = "OK";
                    createLog(DATA_BLOCK);
                    console.log("Purchase Update successfull");
                }

                //console.log("Saved New Purchase Objects", savedObj);
                // Initializing Variables
                var purchaseId = savedObj._id;
                var products = reqData.products;
                delete reqData.products;
                // Required Products Stores all products and varients seperately
                const requiredProducts = [];
                const storeName = reqData.storeName;
                const storeId = reqData.storeId;
                const supplierId = reqData.supplierId;

                // Iterating Over Products and Varients
                for (const temp of products) {
                    const varients = temp.varients;
                    delete temp.varients;
                    for (const tempvar of varients) {
                        const tempProduct = {...temp, ...tempvar };
                        tempProduct["storeName"] = storeName;
                        tempProduct["purchaseId"] = purchaseId;
                        temp["storeId"] = storeId;
                        temp["supplierId"] = supplierId;
                        requiredProducts.push(tempProduct);
                    }
                }
                //console.log("Required Products(Products and respective varients)", requiredProducts);

                Promise.all(
                    requiredProducts.map(async(product) => {
                        try {
                            // Saving Product Into Inventory
                            const savedProduct = await generalLib.saveProductToInvetory(
                                product
                            );
                            return savedProduct;
                        } catch (err) {
                            console.log(
                                "Failed to save products into inventory!, Error:",
                                err.message
                            );
                        }
                    })
                ).then(async(result) => {
                    // Result -> Object with added discount and allocation
                    // Calulating Incentives For Sorter and Labeler
                    await generalLib
                        .calculateIncentiveForPurchase(
                            requiredProducts,
                            reqData.sortedById,
                            reqData.labeledBy
                        )
                        .then((amount) => {
                            //console.log("Incentive Amounts", amount);
                            for (const res of result) {
                                // Queries to log employee incentive data
                                var addQuerySorter = {
                                    purchaseId: purchaseId,
                                    employeeId: reqData.sortedById,
                                    workType: "sorter",
                                };
                                var addQueryLabeler = {
                                    purchaseId: purchaseId,
                                    employeeId: reqData.labeledBy.userId,
                                    workType: "labeler",
                                };

                                if (reqData.sortedById) {
                                    // Sorter
                                    addQuerySorter["incentiveAmount"] = amount[0];
                                    generalLib.addIncentive(addQuerySorter);
                                    var incentiveObjSorter = {
                                        workType: "sorter",
                                        specification: "sorter",
                                        incentiveCalculationType: "Fixed",
                                        incentive: amount[0],
                                    };
                                }
                                if (reqData.labeledBy) {
                                    // Labeler
                                    addQueryLabeler["incentiveAmount"] = amount[1];
                                    const labeledByHere = reqData.labeledBy;
                                    labeledByHere.forEach((labeler) => {
                                        addQueryLabeler.employeeId = labeler.userId;
                                        generalLib.addIncentive(addQueryLabeler);
                                    });
                                    var incentiveObjLabeler = {
                                        workType: "labeler",
                                        specification: "labeler",
                                        incentiveCalculationType: "Fixed",
                                        incentive: amount[1],
                                    };
                                }

                                // Adding incentive data to inventory products
                                res.incentives[0] = incentiveObjSorter ?
                                    incentiveObjSorter :
                                    null;
                                res.incentives[1] = incentiveObjLabeler ?
                                    incentiveObjLabeler :
                                    null;

                                //stockLocation: { store: 0, transientState: 0, warehouse: 0 },
                                res.stockLocation.warehouse = res.quantity;
                                // Updating data
                                inventoryProduct
                                    .findByIdAndUpdate(res._id, res, { useFindAndModify: false })
                                    .then((finalResult) => {
                                        //console.log("Purchase Added Successfully!");
                                    })
                                    .catch((err) => {
                                        console.log(
                                            "Failed to update incentive data in inventory products!, Error:",
                                            err.message
                                        );
                                    });
                            }
                        });
                    var resMsg = {...savedObj.toObject(), ... { products: result } };
                    resMsg
                        ?
                        res.json(resMsg) :
                        res.json({ message: "Something Went Wrong!" });
                });
            });
    }
};