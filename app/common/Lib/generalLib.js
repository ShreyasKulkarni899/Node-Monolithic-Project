const router = require("express").Router();
const bodyParser = require("body-parser");

const counterLib = require("./counterLib.js");
const inventoryProduct = require("../../inventory/models/inventorySchema.js");
const discountsMarginIncentive = require("../discountMargineInentive/models/discountSchema.js");
const productIncentiveSchema = require("../../allocation/models/productIncentiveSchema.js");
const db = require("../models/dbSchema.js");
const Allocation = db.allocation;
const employeeSchema = require("../../employee/models/employeeSchema.js");
const incentive = require("../incentive/models/incentiveSchema.js");
const res = require("express/lib/response");
const { response } = require("express");
const { reject } = require("underscore");

router.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

router.use(bodyParser.json());

const getDiscout = (query) => {
    // console.log("Request string: " + JSON.stringify(req.body));
    return new Promise((resolve, reject) => {
        //console.log(query);
        discountsMarginIncentive
            .find(query, {
                discountType: 1,
                discountCalculatinType: 1,
                discount: 1,
                discountStartDate: 1,
                discountEndDate: 1,
            })

        .then((result) => {
                if (result.length != 0) {
                    //console.log("We got the Discount!");
                } else {
                    // console.log("No Discount is avaliable!!");
                }
                resolve(result);
            })
            .catch((err) => {
                console.log("Error: ", err);
                reject(err);
            });
    });
};

const calculateIncentiveForSell = (product) => {};

const calculateIncentiveForPurchase = (products, sorter, labeler) => {
    // var addQuery = {
    //     purchaseId: products[0].purchaseId,
    //     employeeId: sorter,
    //     workType: "sorter"
    // };
    var amount1 = 0;
    var amount2 = 0;
    //console.log("Sorter and Labeler Here", sorter, labeler);
    return new Promise((resolve, reject) => {
        // products.forEach((product) => {//})
        Promise.all(
                products.map(async(product) => {
                    try {
                        var query = {
                            documentType: "incentive",
                            department: product.department,
                            productItem: product.productItem,
                            productType: product.productType,
                            brand: product.brand,
                        };


                        if (sorter) {
                            await getIncentive(query)
                                .then((result) => {
                                    console.log("result", result, "query", query);
                                    //console.log("Soter result getINcentive", result)
                                    if (result == null) {
                                        amount1 = 0;
                                    } else if (result.incentiveCalculationType == "percent") {
                                        amount1 +=
                                            (result.incentive / 100) *
                                            product.saleRate *
                                            product.quantity;
                                    } else if (result.incentiveCalculationType == "fixed") {
                                        amount1 += result.incentive * product.quantity;
                                    }
                                })
                                .catch((err) => {
                                    console.log("add incetive for sortor", err);
                                });
                        }
                        if (labeler) {
                            query[0].workType = "labeler";
                            query[1].workType = "labeler";
                            query[2].workType = "labeler";
                            query[3].workType = "labeler";
                            await getIncentive(query)
                                .then((result) => {
                                    if (result.incentiveCalculationType == "percent") {
                                        amount2 +=
                                            (result.incentive / 100) *
                                            product.saleRate *
                                            product.quantity;
                                    } else if (result.incentiveCalculationType == "fixed") {
                                        amount2 += result.incentive * product.quantity;
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    } catch {
                        // console.log(err);
                    }

                    return [amount1, amount2];
                })
            )
            .then(() => {
                // console.log(
                //     " Amount1 ",
                //     amount1,
                //     " Amount2 ",
                //     amount2,
                //     " labeler.length ",
                //     labeler.length
                // );save
                resolve([amount1, amount2 / labeler.length]);
                /*
                                        if (sorter) {
                                            addQuery["incentiveAmount"] = amount1;
                                            addIncentive(addQuery)
                                        }
                                        if (labeler) {
                                            addQuery.workType = "labeler"
                                            labeler.forEach((user) => {
                                                addQuery.employeeId = user.userId;
                                                addQuery["incentiveAmount"] = amount2 / labeler.length;
                                                addIncentive(addQuery);
                                            })
                                        }*/
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

const getIncentive = (query) => {
    return new Promise((resolve, reject) => {
        var ans = {};
        //console.log("getIncentive Query", query);
        productIncentiveSchema
            .findOne({ query })
            .then((result) => {
                resolve(result);
                //console.log("REQ INC", result);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

// add incentive to employee
const addIncentive = (query) => {
    return new Promise((resolve, reject) => {
        // Fetching Employee Details
        employeeSchema
            .findById(query.employeeId)
            .then((data) => {
                //console.log("Data in employeeschema return", data);
                //console.log("productIncentive.amount", data.productIncentive.amount);
                var amountHere;
                if (data.productIncentive == null) {
                    amountHere = 0;
                } else {
                    amountHere = data.productIncentive.amount;
                }
                const incentiveData = {
                    productIncentive: {
                        amount: amountHere + parseInt(query.incentiveAmount),

                    },
                };
                // Updating Product Incentive Amount
                employeeSchema
                    .findByIdAndUpdate(query.employeeId, incentiveData, {
                        useFindAndModify: false,
                    })
                    .then((result) => {
                        //console.log("result Product and our incentive Data", result.productIncentive, incentiveData);
                        const sectionHeadQuery = {
                            "workDetails.position": "section-head",
                            "workDetails.department": result.workDetails.department,
                            "workDetails.section": result.workDetails.section,
                        };
                        //console.log("SectionHeadQuery", sectionHeadQuery);
                        employeeSchema
                            .find(sectionHeadQuery)
                            .then((resultHead) => {
                                const incentiveDataSection = {
                                    productIncentive: {
                                        amount: data.productIncentive.amount +
                                            parseInt(query.incentiveAmount),
                                    },
                                };
                                //console.log("resultHEad", resultHead);
                            })
                            .catch((err) => {
                                console.log("Failed to get the section head", err.message);
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "Failed to Update the incentive in employee",
                            err.message
                        );
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log("Failed to get employee", err.message);
                reject(err);
            });
    });
};

// function saveProductToInvetory( product, returnFunction) {
const saveProductToInvetory = (productHere) => {
    return new Promise((resolve, reject) => {
        // console.log("",product);
        // console.log('B:', product.brand, product.description, product.barcode);


        counterLib
            .getNewBarcode(productHere)
            .then((product) => {
                // Query To Get Discount
                const query = {
                    documentType: "discount",
                    department: product.department,
                    productItem: product.productItem,
                    productType: product.productType,
                    brand: product.brand,
                };

                // Get Discount Call
                getDiscout(query)
                    .then((result) => {
                        // Discount Mapping
                        product.discounts = result;
                        console.log("Discount", result, product.discounts);

                        // Alteration in discount query to use for allocation
                        delete query.documentType;
                        getAllocation(query)
                            .then((result) => {
                                // Allocation Attributes Mapping
                                product.storeSection = result[0].storeSection ?
                                    result[0].storeSection :
                                    "Not Alloted";

                                product.warehouseSection = result[0].warehouseSection ?
                                    result[0].warehouseSection :
                                    "Not Alloted";

                                product.counter = result[0].counter ?
                                    result[0].counter :
                                    "Not Alloted";

                                product.rackNo = result[0].rackNo ?
                                    result[0].rackNo :
                                    "Not Alloted";

                                //delete product.varients._id;
                                //Changing the incoming data for excluding the product._id becus it will collide with the _id of inventory
                                //productHEr is the new data without product._id
                                productHere = product;
                                delete productHere._id;
                                // console.log("productHere", productHere);
                                // Saving Product In Inventory
                                var newInventoryProduct = new inventoryProduct(productHere);
                                console.log("new invwntory", newInventoryProduct);
                                newInventoryProduct
                                    .save()
                                    .then((savedObj) => {
                                        //console.log(savedObj);
                                        resolve(savedObj);
                                    })
                                    .catch((err) => {
                                        //console.log(err);
                                        console.log(
                                            "Failed to save in inventory, Duplicate key error in collection"
                                        );
                                        reject(err);
                                    });
                            })
                            .catch((err) => {
                                console.log("Failed to get allocation: ", err.message);
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        console.log("Failed to get discount: ", err.message);
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log("Failed to get barcode ", err.message);
                reject(err);
            });
    });
};

const getProductByBarcode = (barcode) => {
    return new Promise((resolve, reject) => {
        inventoryProduct
            .find({ barcode: barcode })
            .then((result) => {
                if (!result) {
                    reject({ message: "Invalid Barcode", status: 404 });
                } else {
                    console.log(result);
                    resolve({ product: result, status: 200 });
                }
            })
            .catch((err) => {
                resolve({ message: err.message, status: 500 });
            });
    });
};

const updateDiscountInInventoryProduct = (discountParam) => {
    return new Promise((resolve, reject) => {
        const query = {
            department: discountParam.department,
            productItem: discountParam.productItem,
            productType: discountParam.productType,
            brand: discountParam.brand,
        };
        inventoryProduct
            .find(query)
            .then((products) => {
                var data;
                Promise.all(
                        products.map(async(product) => {
                            var discounts = product.discounts;
                            for (var i = 0; i < discounts.length; i++) {
                                if (discounts[i].discountType === discountParam.discountType) {
                                    discounts[i] = discountParam;
                                }
                            }
                            product.discounts = discounts;
                            inventoryProduct
                                .findOneAndUpdate({ _id: product._id }, product, {
                                    upsert: false,
                                    new: true,
                                })
                                .then((updatedInventoryProduct) => {
                                    data = {
                                        productId: updatedInventoryProduct._id,
                                        status: responseCode.SUCCESS,
                                    };
                                })
                                .catch((err) => {
                                    data = {
                                        productId: product._id,
                                        status: responseCode.INTERNAL_SERVER_ERROR,
                                        data: err.message,
                                    };
                                });
                            return data;
                        })
                    )
                    .then((updatedInvnProd) => {
                        resolve(updatedInvnProd);
                    })
                    .catch((err) => {
                        reject({ error: err.message, message: "Error at Backend" });
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const getAllocation = (query) => {
    return new Promise((resolve, reject) => {
        Allocation.find(query, function(err, docs) {
            if (err) {
                reject();
            } else {
                resolve(docs);
            }
        });
    });
};

// const getAllocation = (query) => {
//   try {
//     return new Promise((resolve, reject) => {
//       var queries = [5, 0, 1, 2, 3, 4];
//       const params = ["fabric", "style", "fitting", "pattern", "designNumber"];
//       var data = [];
//       Promise.all(
//         queries.map(async (i) => {
//           if (i != 5) {
//             query[params[i]] = null;
//           }
//           //console.log("Loooookk Hereerer", i, query);
//           await Allocation.findOne(query)
//             .then((allocation) => {
//               //console.log(allocation);
//               console.log("Allocation", allocation);
//             })
//             .catch((err) => {
//               console.log(err.message);
//             });
//           return data;
//         })
//       )
//         .then((result) => {
//           // console.log(result);
//           // var ans = result[0];
//           // var l = Object.keys(ans).length;
//           var canEnter = true;
//           Promise.all(
//             result.map((allocation) => {
//               //console.log("allocation:", allocation, canEnter);
//               if (canEnter && allocation.length != 0) {
//                 canEnter = false;
//                 resolve([allocation]);
//               }
//             })
//           ).catch((err) => {
//             reject(err);
//           });
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };
const updateAllocationOfInventoryProduct = (newAllocationSetting) => {
    try {
        return new Promise(async(resolve, reject) => {
            await inventoryProduct
                .find(newAllocationSetting.query)
                .then((invenProd) => {
                    var data;
                    Promise.all(
                            invenProd.map(async(ip) => {
                                if (ip.currentLocation === "warehouse") {
                                    ip.rackNo = newAllocationSetting.rackNo;
                                    ip.warehouseSection = newAllocationSetting.warehouseSection;
                                } else {
                                    ip.counter = newAllocationSetting.counter;
                                    ip.storeSection = newAllocationSetting.storeSection;
                                }
                                await inventoryProduct
                                    .findOneAndUpdate({ _id: ip._id }, ip, {
                                        upsert: true,
                                        new: true,
                                    })
                                    .then(async(uip) => {
                                        data = uip[0];
                                    })
                                    .catch((err) => {
                                        res
                                            .status(500)
                                            .json({ data: err.message, message: "Backend Error" });
                                    });
                                return data;
                            })
                        )
                        .then(async(uips) => {
                            resolve(uips);
                        })
                        .catch((err) => {
                            reject(err.message);
                        });
                })
                .catch((err) => {
                    reject(err.message);
                });
        });
    } catch (e) {
        console.log("Error: ", e);
        res.status(500).json({ message: "Unexpected Error", data: e });
    }
};

module.exports = {
    getDiscout,
    saveProductToInvetory,
    getIncentive,
    addIncentive,
    calculateIncentiveForPurchase,
    calculateIncentiveForSell,
    getProductByBarcode,
    updateDiscountInInventoryProduct,
    getAllocation,
    updateAllocationOfInventoryProduct,
};