const router = require("express").Router();
const bodyParser = require("body-parser");
const { result } = require("underscore");
const order = require("../../order/models/orderSchema.js");

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

router.use(bodyParser.json());

function dateChecker(dateFirst, dateSecond) {
  var dateResult;
  if (dateFirst <= dateSecond) {
    dateResult = false;
  } else {
    dateResult = true;
  }
  //console.log(dateResult);
  return dateResult;
}

function orderNoValidator() {
  var data;
  order.count({}).exec(async (err, result) => {
    if (err) {
      console.log({ msg: "error found" });
    } else if (!result) {
      console.log({ message: "Not found" });
    } else {
      console.log("result in dateLib " + result);
      data = result;
      return result;
    }
  });
  // return data;
}

module.exports = { dateChecker, orderNoValidator };
