const purchaseReturnSchema = require("../models/purchaseReturnSchema.js");
const inventoryProduct = require("../../inventory/models/inventorySchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
    DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
    createLog,
} = require("../../common/Logger/controller/LoggerController.js");

exports.addPurchaseReturn = async(req, res) => {
    DATA_BLOCK.endpoint = "/purchaseReturn/addPurchaseReturn/";
    DATA_BLOCK.method = "POST";

    result = require("../utils/purchaseReturnSchemaValidate.js")(req.body);

    if (!req.body) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);

        res.status(responseCodes.BAD_REQUEST).send({
            status: "NOK",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
        });
    }

    if (result) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);

        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "NOK",
            code: responseCodes.VALIDATE_FAIL,
            message: result,
        });
    } else {
        reqData = req.body;
        var newReturn = purchaseReturnSchema(reqData);
        var resMsg = {};
        // var updateInventoryStatus = [];
        newReturn
            .save()
            .then((result) => {
                // reqData.productsList.forEach(product => {
                // console.log(result);
                Promise.all(
                        reqData.productsList.map(async(product) => {
                            // generalLib.updateInventory(product)
                            var data;
                            await inventoryProduct
                                .find({ _id: product.productId })
                                .then(async(inProd) => {
                                    // console.log()
                                    // console.log(inProd[0].quantity);
                                    if (inProd.length > 1) {
                                        data = {
                                            productId: product.productId,
                                            message: "Multiple Product with same ID",
                                            status: 403,
                                        };
                                    } else if (inProd.length == 1) {
                                        // console.log("ala");
                                        inProd[0].quantity = inProd[0].quantity - product.quantity;
                                        // console.log("1", inProd[0].quantity, product.quantity);
                                        if (inProd[0].quantity < 0) {
                                            data = {
                                                productId: product.productId,
                                                message: "Quantity is greater than stock",
                                                status: responseCode.BAD_REQUEST,
                                            };
                                        }
                                        await inventoryProduct
                                            .findOneAndUpdate({ _id: product.productId }, inProd[0], {
                                                upsert: false,
                                                new: true,
                                            })
                                            .then(async() => {
                                                data = { productId: product.productId, status: 200 };
                                            })
                                            .catch((err) => {
                                                data = {
                                                    productId: product.productId,
                                                    message: err,
                                                    status: 500,
                                                };
                                            });
                                    } else {
                                        data = {
                                            productId: product.productId,
                                            message: err,
                                            status: 404,
                                        };
                                    }
                                })
                                .catch((err) => {
                                    data = {
                                        productId: product.productId,
                                        message: err.message,
                                        status: 404,
                                    };
                                });
                            // });
                            return data;
                        })
                    )
                    .then(async(updateInventoryStatus) => {
                        DATA_BLOCK.status = "OK";
                        createLog(DATA_BLOCK);
                        //console.log(updateInventoryStatus, "ala ka");
                        resMsg["updateInventoryStatus"] = updateInventoryStatus;
                        resMsg["addPurchaseReturnStatus"] = result;

                        res.status(responseCodes.NEW_RESOURCE_CREATED).send({
                            status: "OK",
                            code: responseCodes.NEW_RESOURCE_CREATED,
                            message: messages.NEW_RESOURCE_CREATED,
                            data: resMsg,
                        });
                    })
                    .catch((err) => {
                        DATA_BLOCK.status = "FAILED";
                        createLog(DATA_BLOCK);
                        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                            status: "failed",
                            code: responseCodes.INTERNAL_SERVER_ERROR,
                            message: messages.SOMETHING_WENT_WRONG,
                        });
                    });
            })
            .catch(() => {
                DATA_BLOCK.status = "FAILED";
                createLog(DATA_BLOCK);
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "failed",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG,
                });
            });
    }
};

exports.getPurchaseReturn = async(req, res) => {
    const id = req.params.id;
    purchaseReturnSchema
        .findById(id)
        .then((result) => {
            if (result) {
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_RETRIVING_DATA,
                    data: result,
                });
            } else {
                res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            }
        })
        .catch((err) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

exports.getAllPurchaseReturns = async(req, res) => {
    const id = req.params.id;
    purchaseReturnSchema
        .find()
        .then((result) => {
            if (result) {
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_RETRIVING_DATA,
                    data: result,
                });
            } else {
                res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            }
        })
        .catch((err) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};
exports.updatePurchaseReturn = async(req, res) => {
    DATA_BLOCK.endpoint =
        "/purchaseReturn/updatePurchaseReturn/" + String(req.params.id);
    DATA_BLOCK.method = "PUT";
    reqData = req.body;
    var resMsg = {};
    purchaseReturnSchema
        .find({ _id: reqData._id })
        .then((result) => {
            // console.log(result);
            if (!result) {
                DATA_BLOCK.status = "Failed";
                createLog(DATA_BLOCK);
                res.json({ message: "Invalid Id", status: 404 });
            } else {
                var prevReturnProd = result[0].productsList;
                var reqProd = {};
                prevReturnProd.forEach((prod) => {
                    reqProd[prod.productId] = prod;
                });
                // console.log(reqProd);
                // console.log(reqData.productsList);
                var data;
                Promise.all(
                        reqData.productsList.map(async(returnProd) => {
                            if (returnProd.modified === "modified") {
                                // purchaseReturnSchema.findOneAndUpdate({_id : returnProd._id}, returnProd.quantity, {upsert:false, new:true})
                                // .then((updatedReturnProd) => {
                                // console.log('2', returnProd);
                                await inventoryProduct
                                    .find({ _id: returnProd.productId })
                                    .then(async(inProd) => {
                                        // console.log(inProd);
                                        inProd = inProd[0];
                                        // console.log("A", inProd.quantity, reqProd[returnProd.productId].quantity, returnProd.quantity);
                                        inProd.quantity +=
                                            reqProd[returnProd.productId].quantity -
                                            returnProd.quantity;
                                        // console.log("B", inProd.quantity, reqProd[returnProd.productId].quantity, returnProd.quantity);
                                        await inventoryProduct
                                            .findOneAndUpdate({ _id: inProd._id }, inProd, {
                                                upsert: false,
                                                new: false,
                                            })
                                            .then(() => {
                                                console.log(3);
                                                resMsg[returnProd.productId] = { status: 200 };
                                                data = {
                                                    _id: returnProd._id,
                                                    productId: returnProd.productId,
                                                    quantity: returnProd.quantity,
                                                };
                                            })
                                            .catch((err) => {
                                                resMsg[returnProd.productId] = {
                                                    message: err,
                                                    status: 500,
                                                };
                                                // data = {}
                                            });
                                    })
                                    .catch((err) => {
                                        resMsg[returnProd.productId] = { message: err, status: 500 };
                                    });
                                // })
                            } else if (returnProd.modified === "new") {
                                await inventoryProduct
                                    .find({ _id: returnProd.productId })
                                    .then(async(inProd) => {
                                        inProd[0].quantity -= returnProd.quantity;
                                        console.log("asdf", inProd, inProd[0].quantity);
                                        if (inProd[0].quantity < 0) {
                                            resMsg[returnProd.productId] = {
                                                message: "returnQuyantity greater than stock",
                                            };
                                        } else {
                                            await inventoryProduct
                                                .findOneAndUpdate({ _id: inProd[0]._id }, inProd[0], {
                                                    upsert: false,
                                                    new: true,
                                                })
                                                .then((x) => {
                                                    console.log("adsd", x);
                                                    data = {
                                                        productId: returnProd.productId,
                                                        quantity: returnProd.quantity,
                                                    };
                                                    resMsg[returnProd.productId] = { status: 200 };
                                                })
                                                .catch((err) => {
                                                    resMsg[returnProd.productId] = {
                                                        Error: err.message,
                                                        status: 500,
                                                    };
                                                });
                                        }
                                    })
                                    .catch((err) => {
                                        resMsg[returnProd.productId] = { message: err, status: 500 };
                                    });
                            } else if (returnProd.modified === "delete") {
                                data = {
                                    _id: returnProd._id,
                                    productId: returnProd.productId,
                                    quantity: returnProd.quantity,
                                    isDeleted: true,
                                };
                                await inventoryProduct
                                    .find({ _id: returnProd.productId })
                                    .then(async(inProd) => {
                                        inProd.quantity += reqProd[returnProd.productId].quantity;
                                        await inventoryProduct.findOneAndUpdate({ _id: inProd._id },
                                            inProd, { upsert: false, new: true }
                                        );
                                        resMsg[returnProd.productId] = { status: 200 };
                                    })
                                    .catch((err) => {
                                        resMsg[returnProd.productId] = { message: err, status: 500 };
                                    });
                            } else {
                                data = {
                                    _id: returnProd._id,
                                    productId: returnProd.productId,
                                    quantity: returnProd.quantity,
                                };
                            }
                            console.log(4);
                            return data;
                        })
                    )
                    .then((prodList) => {
                        console.log("PList: ", prodList);
                        result[0].productsList = prodList;
                        // console.log(result[0].productsList);
                        purchaseReturnSchema
                            .findOneAndUpdate({ _id: reqData._id }, result[0], {
                                upsert: false,
                                new: true,
                            })
                            .then((result) => console.log(result))
                            .catch((err) => console.log(err));
                        res.json(resMsg);
                    })
                    .catch((err) => {
                        res.json({
                            message: "error at backend1122",
                            Error: err.message,
                            status: 500,
                        });
                    });
            }
        })
        .catch((err) => {
            DATA_BLOCK.status = "FAILED";
            createLog(DATA_BLOCK);
            res.status(500);
        });
};