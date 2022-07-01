const db = require("../../common/models/dbSchema.js");
const Store = require("../../store/models/storeSchema.js");

const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const counter = require("../../counter/models/counterSchema");
const { prefixArrays } = require("../../common/constant/constant");
// const Store = db.store;

//Create and Save a new Store
exports.create = (req, res) => {
  //console.log("IN CReate");
  // Validate request
  if (!req.body) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: result,
    });
    return;
  }

  //Json Validator
  var result = require("../utils/storeValidateSchema.js")(req.body);
  if (result) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: result,
    });
  } else {
    // Create new Store
    counter
      .findByIdAndUpdate(
        "prefixCounter",
        { $inc: { counter: 1 } },
        { new: true, upsert: true }
      )
      .then((prefix) => {
        if (prefix.counter > 27 || prefix.counter < 0) {
          counter
            .findByIdAndUpdate(
              "prefixCounter",
              { $inc: { counter: 0 } },
              { new: true, upsert: true }
            )
            .catch((err) => {
              res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
              });
            });
        } else {
          var reqData = req.body;
          reqData.barcodePrefix = prefixArrays.prefixes[prefix.counter];
          const store = new Store(reqData);
          // Save  Store Model In Database
          store
            .save(store)
            .then((data) => {
              res.status(responseCodes.SUCCESS_CODE).send({
                status: "Successful",
                code: responseCodes.SUCCESS_CODE,
                message: messages.NEW_RESOURCE_CREATED,
                data: data,
              });
            })
            .catch((err) => {
              res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
              });
            });
        }
      });

    //     const store = new Store(
    //         {
    //             logoUrl: req.body.logoUrl,
    //             storeName: req.body.storeName,
    //             proprietorName: req.body.proprietorName,
    //             gstNo: req.body.gstNo,
    //             emailAddress: req.body.emailAddress,
    //             contact: req.body.contact,
    //             address: {
    //                 firstLine: req.body.address.firstLine,
    //                 secondLine: req.body.address.secondLine,
    //                 city: req.body.address.city,
    //                 postalCode: req.body.address.postalCode,
    //                 state: req.body.address.state,
    //                 country: req.body.address.country,
    //             },
    //             taxMethod: req.body.taxMethod,
    //             storeCustomField1: req.body.storeCustomField1,
    //             storeCustomField2: req.body.storeCustomField2,
    //             barcodePrefix: req.body.barcodePrefix,
    //             additionalDescription: req.body.additionalDescription,
    //             status: req.body.status
    //         });

    //     //save store in the database
    //     console.log("Store", store);
    //     store
    //         .save(store)
    //         .then(data => {
    //             res.send(data);
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message:
    //                     err.message || "Some error occured while creating a store."
    //             });
    //         });
  }
};

// Retrieve all Store from the database.
exports.findAll = (req, res) => {
  // const gstNo = req.query.gstNo;
  // var condition = gstNo ? { gstNo: { $regx: new RegExp(gstNo), $option: "i" } } : {};

  const params = req.query;
  var condition = params;

  var page = req.query.page;
  var limit = req.query.limit;
  var sortBy = req.query.sortBy;
  var sortOrder = req.query.sortOrder;
  let sortOption = {};
  sortOption[`${sortBy}`] = sortOrder;
  var options = {
    page: page || 1,
    limit: limit || 10,
    sort: sortOption,
  };

  Store.paginate({ condition }, options)
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "Successful",
        code: responseCodes.SUCCESS_CODE,
        message: messages.DATA_FETCHED,
        data: data,
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

// Find a single Store
exports.findOne = (req, res) => {
  const id = req.params.id;

  Store.findById(id)
    .then((data) => {
      if (!data)
        res.status(responseCodes.BAD_REQUEST).send({
          status: "failed",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_ID_FOUND,
        });
      else
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "Successful",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_RETRIVING_DATA,
          data: data,
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

// Udate Store By Id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: messages.NO_ID_FOUND,
    });
  }

  //Json Validator
  var result = require("../utils/storeValidateSchema.js")(req.body);
  if (result) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "failed",
      code: responseCodes.BAD_REQUEST,
      message: result,
    });
  } else {
    const id = req.params.id;

    Store.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
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
            data: data,
          });
      })
      .catch((err) => {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
          status: "failed",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: messages.SOMETHING_WENT_WRONG,
        });
      });
  }
};

// Delete a Store with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Store.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "failed",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_ID_FOUND,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "Successful",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_DELETING_DATA,
          data: data,
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

// Delete all Store from the database.
exports.deleteAll = (req, res) => {
  Store.deleteMany({})
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: `${data.deletedCount} Store were deleted successfully!`,
        data: data,
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
