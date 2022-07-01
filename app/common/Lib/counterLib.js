const router = require("express").Router();
const bodyParser = require("body-parser");
const { result } = require("underscore");
const counter = require("../../counter/models/counterSchema.js");
const store = require("../../store/models/storeSchema.js");
// const validator = require('../helper/validate');
// const { reject } = require("async");
const { prefixArrays } = require("../constant/constant.js");

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

router.use(bodyParser.json());

function getNextSequenceValue(sequenceName, returnFunction) {
  var hereData = 0;
  counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { counter: 1 } },
    { new: true, upsert: true },
    function (error, dbReturn) {
      // The callback
      if (error) {
        console.log(error);
        returnFunction(error);
        // return error;
      } else {
        // console.log("infunction" + JSON.stringify(dbReturn));
        //returnFunction(dbReturn.counter.toString(), product);
        returnFunction(dbReturn.counter);
        return dbReturn.counter;
      }
    }
  );
  return hereData;
}

// function getNextSequenceValue(sequenceName, returnFunction) {
//     let data = 0;

//     counter.findByIdAndUpdate(sequenceName, { $inc: { counter: 1 } }, { new: true, upsert: true },
//         function(err, result) {
//             if (err) {
//                 returnFunction(err);

//             } else {
//                 //data = result;
//                 //returnFunction = result;
//                 console.log("infunction" + JSON.stringify(result));
//                 console.log(result.counter);
//                 returnFunction(result.counter);
//                 return result.counter;
//                 //var str = JSON.stringify(result);

//                 // console.log("infunction_data"+ JSON.stringify(data));

//             }

//         });
// }

// async function getNewBarcode(product, returnFunction) {
// console.log('C:', product.brand, product.description, product.barcode);
const getNewBarcode = (product) => {
  return new Promise((resolve, reject) => {
    counter
      .findByIdAndUpdate(
        "barcode",
        { $inc: { counter: 1 } },
        { new: true, upsert: true }
      )
      .then((result) => {
        // Fetching barcode prefix from store
        const id = product.storeId;
        store
          .findOne({ storeName: product.storeName })
          .then((storeData) => {
            counter
              .findByIdAndUpdate(
                "inventoryCounter",
                { $inc: { counter: 1 } },
                { new: true, upsert: true }
              )
              .then((inventoryCount) => {
                if (inventoryCount !== null) {
                  if (storeData === null || inventoryCount.counter > 10000) {
                    reject("No record Found");
                    inventoryCount.counter = 0;
                    counter.findByIdAndUpdate(
                      "inventoryCounter",
                      inventoryCount
                    );
                  } else {
                    var prefix = storeData.barcodePrefix;
                    var currentDate = new Date();
                    var currentYear = currentDate
                      .getFullYear()
                      .toString()
                      .slice(2, 4);
                    var currentMonth = currentDate.getMonth();
                    var month = prefixArrays.months[currentMonth];

                    var countInventory = inventoryCount.counter
                      .toString()
                      .padStart(4, "0");
                    var barcode = prefix + currentYear + month + countInventory;
                    product["barcode"] = barcode;
                    resolve(product);
                  }
                }
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

module.exports = { getNextSequenceValue, getNewBarcode };
