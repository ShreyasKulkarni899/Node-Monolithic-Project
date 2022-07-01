const db = require("../../common/models/dbSchema.js");
const orderSchema = require("../models/orderSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
_ = require("underscore");
//var counterLib = require("../../common/Lib/counterLib.js");
var counter = require("../../counter/models/counterSchema.js");
var dateChecker = require("../../common/Lib/dateLib.js");
const { result } = require("underscore");
const {
  DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
  createLog,
} = require("../../common/Logger/controller/LoggerController.js");

//pending rece draft
exports.addOrder = async (req, res) => {
  DATA_BLOCK.endpoint = "/order/addorder/";
  DATA_BLOCK.method = "POST";
  var validationResult = require("../util/orderValidator.js")(req.body);
  var dateFirst = req.body.orderDate;
  var dateSecond = req.body.estimatedDeliveryDate;

  if (validationResult || dateChecker.dateChecker(dateFirst, dateSecond)) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);
    return res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: validationResult + " or wrong order date ",
    });
  } else {
    //console.log("data validated");
    try {
      // const orderResultHere = counterLib.getNextSequenceValue("orderNo", returnFunction);
      // console.log(returnFunction, orderResultHere);
      //console.log("return value of counterLib" + orderResultHere);
      // const orderNoHere = parseInt(orderResultHere.counter);
      //most of the code her is under working
      //var orderModel = new orderSchema(_.extend({ orderNo: `${ orderNoHere }` }, req.body));
      const orderModel = new orderSchema(req.body);
      // console.log(orderNoHere, );
      const order = await orderModel.save(function (err, result) {
        if (err) {
          DATA_BLOCK.status = "FAILED";
          createLog(DATA_BLOCK);
          res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "NOK",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
          });
        } else {
          counter.findByIdAndUpdate(
            "orderNo",
            { $inc: { counter: 1 } },
            { new: true, upsert: true },
            (err, result) => {
              if (err) {
                console.log(err);
                res.json(err);
              } else {
                data = result;
                console.log("infunction" + JSON.stringify(result));

                // console.log("infunction_data"+ JSON.stringify(data));
              }
            }
          );
          DATA_BLOCK.status = "OK";
          createLog(DATA_BLOCK);
          res.status(responseCodes.NEW_RESOURCE_CREATED).send({
            status: "OK",
            code: responseCodes.NEW_RESOURCE_CREATED,
            message: messages.NEW_RESOURCE_CREATED,
            data: order,
          });
        }
      });
    } catch (e) {
      DATA_BLOCK.status = "FAILED";
      createLog(DATA_BLOCK);
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    }
  }
};

exports.getOrderById = (req, res) => {
  const orderId = req.body.id;

  var validationResult = require("../util/orderValidator.js")(req.body);

  if (!validationResult) {
    return res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: "validation failed",
    });
  } else {
    console.log("validation passed", orderId);
    orderSchema
      .find({ _id: orderId })
      // populate('storeId').
      // populate('orderedById').
      // populate('supplierId').
      // populate('transportId').
      .exec((err, result) => {
        if (!result) {
          res.json("Not found");
        }
        res.json(result);
        console.log(result);
      });
  }
};

exports.getAllOrder = (req, res) => {
  //orderSchema.find({}, { products: 0, createdAt: 0, updatedAt: 0, __v: 0, attachmentUrl: 0 }).populate('supplierDetails', 'suplierDetails.supplierName').populate('orderBy', 'personalDetails.firstName').exec(async(err, result) => {
  orderSchema.find({}).exec(async (err, result) => {
    if (err) {
      return res.json({ msg: "error found" });
    } else if (!result) {
      return res.json({ message: "Not found" });
    } else {
      return res.json(result);
    }
  });
  //});
};

exports.updateOrder = (req, res) => {
  DATA_BLOCK.endpoint = "/order/updateorder/" + String(req.body.id);
  DATA_BLOCK.method = "POST";
  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);

    return res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: "Data to update can not be empty!",
    });
  }

  const id = req.body.id;

  orderSchema
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: `Cannot update order Model with id=${id}. Maybe order Model was not found!`,
        });
      } else {
        DATA_BLOCK.status = "OK";
        createLog(DATA_BLOCK);
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_UPDATING_DATA,
          data: data,
        });
      }
    })
    .catch((err) => {
      DATA_BLOCK.status = "FAILED";
      createLog(DATA_BLOCK);
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

exports.deleteOrder = (req, res) => {
  const id = req.body.id;

  orderSchema
    .findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: `Cannot update order Model with id=${id}. Maybe order Model was not found!`,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: "order Model was deleted successfully!",
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

exports.getOrderByFilter = (req, res) => {
  reqData = req.body;
  // orderConditon = []
  // console.log(reqData)
  // for (let orderStatus of reqData){
  //   orderConditon.push({
  //       orderStatus : reqData[orderStatus]
  //   });
  // }

  // for (var property in reqData) {
  //   console.log(`${property}: ${reqData[property]}`);
  //   orderConditon.push({
  //     property : reqData[property]
  //   });
  // }
  filter = [];

  filter.push(reqData.filter);
  console.log(filter, reqData.data);
  orderSchema.find({ $and: filter }, reqData.data, async (err, result) => {
    if (err) {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    } else if (!result) {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "NOK",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    } else {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: result,
      });
    }

    console.log(result);
    //res.json(result);
  });
};

exports.deleteOrderStatus = (req, res) => {
  var validationResult = require("../util/orderValidator.js")(req.body);
  if (!validationResult) {
    res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: messages.PROBLEM_IN_DATA,
    });
  } else {
    const orderId = req.body.id;
    //console.log("validation passed", orderId)
    orderSchema.findOneAndUpdate(
      { _id: orderId },
      validationResult,
      { new: true },
      async (err, result) => {
        if (!result) {
          res.status(responseCodes.BAD_REQUEST).send({
            status: "NOK",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
          });
        }
        res.status(responseCodes.NEW_RESOURCE_CREATED).send({
          status: "OK",
          code: responseCodes.NEW_RESOURCE_CREATED,
          message: messages.NEW_RESOURCE_CREATED,
          data: result,
        });
      }
    );
  }
};

exports.getOrderNumber = (req, res) => {
  orderSchema
    .findOne({}, "orderNo")
    .sort({ orderNo: -1 })
    .limit(1)
    .exec(async (err, result) => {
      if (err) {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
          status: "NOK",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: messages.SOMETHING_WENT_WRONG,
        });
      } else if (!result) {
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: messages.NO_DATA,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_RETRIVING_DATA,
          data: result,
        });
      }
    });
};
exports.updateOrderStatus = (req, res) => {
  DATA_BLOCK.endpoint = "/order/updateorderstatus/" + String(req.body.id);
  DATA_BLOCK.method = "POST";
  const orderId = req.body.id;

  orderSchema
    .findByIdAndUpdate(orderId, { orderStatus: req.status }, { new: true })
    .then((res) => {
      DATA_BLOCK.status = "OK";
      createLog(DATA_BLOCK);
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: res,
      });
    })
    .catch((err) => {
      DATA_BLOCK.status = "FAILED";
      createLog(DATA_BLOCK);
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};
