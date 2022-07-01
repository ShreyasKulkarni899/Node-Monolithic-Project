const Parcel = require("../models/parcelSchema.js");
const Order = require("../../order/models/orderSchema.js");
const Joi = require("joi");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const dateChecker = require("../../common/Lib/dateLib.js");
const counter = require("../../counter/models/counterSchema.js");

// Create amd save a new Parcel request

exports.create = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
  }

  // Json Validator
  var result = require("../utils/parcelValidatorSchema.js")(req.body);
  if (result) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: result,
    });
  } else {
    var options = {};
    options["supplierId"] = req.body.supplierId;
    options["storeId"] = req.body.storeId;
    options["orderNo"] = req.body.orderNumber[0];

    Order.findOne(options)
      .then((data) => {
        if (!data) {
          console.log("Inside Request Data Not Found");
          return res.status(404).send({
            status: "NOK",
            code: responseCodes.FAILURE_CODE,
            message: messages.NO_DATA,
          });
        }
        var orderDate = data.orderDate;
        var receivedDate = req.body.parcelReceivedDate
          ? req.body.parcelReceivedDate
          : "";

        if (dateChecker.dateChecker(orderDate, new Date(receivedDate))) {
          //console.log("Inside Data Check Failed");
          return res.status(responseCodes.VALIDATE_FAIL).send({
            status: "NOK",
            message: messages.DATE_ERROR,
            code: responseCodes.FAILURE_CODE,
          });
        } else {
          // Create new Parcel
          const parcel = new Parcel(req.body);
          // Save  parcel Model In Database
          parcel
            .save(parcel)
            .then((data) => {
              const orderNo = req.body.orderNumber;
              Order.findOneAndUpdate(
                { orderNo: orderNo },
                { orderStatus: "Received" }
              )
                .then((data) => {
                  counter.findByIdAndUpdate(
                    "parcelNumber",
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
                  res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.NEW_RESOURCE_CREATED,
                    data: parcel,
                  });
                  // console.log(data);
                })
                .catch((err) => {
                  res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: err.message,
                  });
                });
            })
            .catch((err) => {
              res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG + err.message,
              });
            });
        }
      })
      .catch((err) => {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
          status: "failed",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: messages.SOMETHING_WENT_WRONG + err.message,
        });
      });
  }
};

exports.findAll = (req, res) => {
  // const parcelNumber = req.query.parcelNumber;
  // var condition = parcelNumber ? { parcelNumber: { $regx: new RegExp(parcelNumber), $option: "i" } } : {};

  // const params = req.query;
  // var condition = params;

  // var page = req.query.page;
  // var limit = req.query.limit;
  // var sortBy = req.query.sortBy;
  // var sortOrder = req.query.sortOrder;
  // let sortOption = {}
  // sortOption[`${sortBy}`] = sortOrder
  // var options = {
  //     page: page || 1,
  //     limit: limit || 10,
  //     sort: sortOption,
  // }

  //Parcel.find({ condition }, options)
  Parcel.find({})
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: data,
      });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "OK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  // const parcelId = req.body.parcelNumber;
  const joiSchema = Joi.object({ lrNumber: Joi.string() });
  const result = joiSchema.validate(req.query.lrNumber);

  if (!result) {
    res.status(responseCodes.VALIDATE_FAIL).send({
      status: "OK",
      code: responseCodes.VALIDATE_FAIL,
      message: messages.VALIDATE_FAIL,
      data: result,
    });
  } else {
    Parcel.find({ _id: id }).exec((err, result) => {
      if (err) {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
          status: "failed",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: messages.SOMETHING_WENT_WRONG,
        });
      } else if (!result) {
        res.status(responseCodes.FAILURE_CODE).send({
          status: "failed",
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
  }
};

//pending  par reci draft
// Update
exports.update = (req, res) => {
  const parcelNumber = req.query.parcelNumber;
  // var condition = parcelNumber ? { parcelNumber: { $regx: new RegExp(parcelNumber), $option: "i" } } : {};
  const id = req.params.id;

  Parcel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((result) => {
      // console.log(result);
      if (!result) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "failed",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_ID_FOUND,
        });
      } else
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "Successful",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_UPDATING_DATA,
          data: result,
        });
      // res.status(responseCode.SUCCESS).json(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
      // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
    });
};

// Delete
exports.delete = (req, res) => {
  // console.log("ala");
  const id = req.params.id;
  Parcel.findByIdAndRemove(id, { useFindAndModify: false })
    // DropdownList.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: false, new: true })
    .then((result) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_DELETING_DATA,
      });
      // console.log(result);
      // res.status(200).json(result);
      // res.status(responseCode.SUCCESS).json(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
      // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
    });
};

//delete all
exports.deleteAll = (req, res) => {
  Parcel.deleteMany({})
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_DELETING_DATA,
      });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "failed",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

exports.getLRNumberByOrder = async (req, response) => {
  reqData = req.body;
  const joiSchema = Joi.object({ orderNumber: Joi.array() });
  const result = joiSchema.validate(req.body.orderNumber);

  if (!result) {
    return response.status(400).json({
      success: "fail",
      //message: "validation failed",
      data: err,
    });
  } else {
    //filter = [];

    //filter.push(reqData.filter)
    try {
      if (reqData.orderNumber) {
        var query = { orderNumber: { $in: reqData.orderNumber } };
      } else {
        var query = {
          purchaseReturnNumber: { $in: reqData.purchaseReturnNumber },
        };
      }
      await Parcel.find(query, reqData.data)
        .then((result) => {
          if (result.length > 0) {
            response.json({
              status: "success",
              data: result,
            });
          } else {
            response.json({
              status: "fail",
              data: "Not Found",
            });
          }
        })

        .catch((err) => {
          res.json(err);
          response.json({
            status: "fail",
            data: err,
          });
        });
    } catch (err) {
      response.json(err);
    }
  }
};
