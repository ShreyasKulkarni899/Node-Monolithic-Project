const router = require("express").Router();
const bodyParser = require("body-parser");

const counter = require("../../counter/models/counterSchema.js");
//const validator = require('../helper/validate');
const counterLib = require("../Lib/counterLib.js");
const inventoryProduct = require("../../inventory/models/inventorySchema.js");
//const { readJson } = require("fs-extra");
//const { reject } = require("async");
const discountsMarginIncentive = require("../discountMargineInentive/models/discountSchema.js");
const allocationSchema = require("../../allocation/models/allocationSchema.js");
//const incentive = require('../models/incentiveSchema');
const incentive = require("../incentive/models/incentiveSchema.js");
//const responseCode = require('../helper/responseCode');
//const { CostExplorer } = require("aws-sdk");
router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

router.use(bodyParser.json());

const getDiscout = (query) => {
  // console.log("Request string: " + JSON.stringify(req.body));
  return new Promise((resolve, reject) => {
    discountsMarginIncentive
      .find(query, {
        discountType: 1,
        discountCalculatinType: 1,
        discount: 1,
        discountStartDate: 1,
        discountEndDate: 1,
      })
      .then((result) => {
        // console.log('getDiscount: ', result);
        // var discount = result.discount;
        // if (result.discountCalculatinType === 'percent') {
        //     discount = query.purchaseCost * (discount) / 100
        // }
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
  return new Promise((resolve, reject) => {
    // products.forEach((product) => {//})
    Promise.all(
      products.map(async (product) => {
        try {
          var query = {
            $match: {
              $or: [
                {
                  documentType: "incentive",
                  workType: "sortor",
                  department: "Mens",
                  productItem: "Baniyan",
                  productType: "Vest",
                  brand: "Lux Cozi",
                },
                {
                  documentType: "incentive",
                  workType: "sortor",
                  department: "Mens",
                  productItem: "Baniyan",
                  productType: "Vest",
                  brand: null,
                },
                {
                  documentType: "incentive",
                  workType: "sortor",
                  department: "Mens",
                  productItem: "Baniyan",
                  productType: null,
                  brand: null,
                },
                {
                  documentType: "incentive",
                  workType: "sortor",
                  department: "Mens",
                  productItem: null,
                  productType: null,
                  brand: null,
                },
              ],
            },
          };
          if (sorter) {
            await getIncentive(query)
              .then((result) => {
                if (result.incentiveCalculationType == "percent") {
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
    discountsMarginIncentive
      .aggregate(
        [query]
        /*, {
                            'incentiveType': 1,
                            'incentiveCalculationType': 1,
                            'incentive': 1
                        }*/
      )
      .then((result) => {
        console.log("A");
        console.log(result);
        const reqIncentive = result.reduce((rec, curr) => {
          count = 0;
          if (curr.brand === null) {
            count++;
          }
          if (curr.department === null) {
            count++;
          }
          if (curr.productType === null) {
            count++;
          }
          if (curr.productItem === null) {
            count++;
          }
          if (count < rec) {
            rec = count;
            ans = curr;
          }
          return ans;
        }, 4);
        //if null then add to notificationSchema
        // if (result.length != 4) {
        //     query = {
        //         "message": "Add incentive for following product",
        //         department: query[0].department,
        //         productItem: query[0].productItem,
        //         productType: query[0].productType,
        //         brand: query[0].brand
        //     }
        //     // addNotification()
        // }
        resolve(reqIncentive);
        console.log(reqIncentive);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

// add incentive to employee
const addIncentive = (data) => {
  const newIncentive = new incentive(data);
  newIncentive.save();
};

// function saveProductToInvetory( product, returnFunction) {
const saveProductToInvetory = (product) => {
  return new Promise((resolve, reject) => {
    // console.log("",product);
    // console.log('B:', product.brand, product.description, product.barcode);

    counterLib
      .getNewBarcode(product)
      .then((product) => {
        // console.log(barcode);
        // product["purchaseId"] = purchaseId;
        const query = {
          documentType: "discount",
          department: product.department,
          productItem: product.productItem,
          productType: product.productType,
          brand: product.brand, //,
          //purchaseCost: product.netPurchasePrice
        };
        getDiscout(query)
          .then((result) => {
            // console.log("call getDiscount: ", result);
            product.discounts = result;
            delete query.documentType;
            getAllocation(query)
              .then((result) => {
                var newInventoryProduct = new inventoryProduct(product);
                // console.log(temp);
                // console.log('D before save:', product.brand, product.description, product.barcode);
                newInventoryProduct
                  .save()
                  .then((savedObj) => {
                    resolve(savedObj);
                  })
                  .catch((err) => {
                    console.log("savetoInverntory Error: ", err);
                    reject(err);
                  });
              })
              .catch((err) => {
                console.log("getAllocationError: ", err.message);
                reject(err);
              });
          })
          .catch((err) => {
            console.log("getDiscount Error: ", err);
            reject(err);
          });
        // console.log('D after save:', savedObj.brand, savedObj.description, savedObj.barcode);
        // invertoryProductList.push(savedObj._id);
      })
      .catch((err) => {
        console.log("getBarode Error: ", err);
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
          products.map(async (product) => {
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
  try {
    return new Promise((resolve, reject) => {
      var queries = [5, 0, 1, 2, 3, 4];
      const params = ["fabric", "style", "fitting", "pattern", "designNumber"];
      var data = [];
      Promise.all(
        queries.map(async (i) => {
          if (i != 5) {
            query[params[i]] = null;
          }
          console.log(i, query);
          await allocationSchema
            .findOne(query)
            .then((allocation) => {
              console.log(allocation);
              if (allocation.length != 0) data = allocation;
            })
            .catch((err) => {
              console.log(err.message);
            });
          return data;
        })
      )
        .then((result) => {
          // console.log(result);
          // var ans = result[0];
          // var l = Object.keys(ans).length;
          var canEnter = true;
          Promise.all(
            result.map((allocation) => {
              console.log("allocation:", allocation, canEnter);
              if (canEnter && allocation.length != 0) {
                canEnter = false;
                resolve([allocation]);
              }
            })
          ).catch((err) => {
            reject(err);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (e) {
    console.log(e);
  }
};

const updateAllocationOfInventoryProduct = (newAllocationSetting) => {
  try {
    return new Promise(async (resolve, reject) => {
      await inventoryProduct
        .find(newAllocationSetting.query)
        .then((invenProd) => {
          var data;
          Promise.all(
            invenProd.map(async (ip) => {
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
                .then(async (uip) => {
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
            .then(async (uips) => {
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
