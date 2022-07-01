const productIncentiveHere = require("../../allocation/models/productIncentiveSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
  DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
  createLog,
} = require("../../common/Logger/controller/LoggerController.js");

// Create and Persist a new Allocation
// Create function
exports.create = (req, res) => {
  DATA_BLOCK.endpoint = "/allocation/productIncentive/";
  DATA_BLOCK.method = "POST";

  var result = require("../utils/productIncetiveValidateSchema.js")(req.body);
  // Validation of request
  if (!req.body) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.NO_VALID_DATA,
    });
    return;
  }

  if (result) {
    res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: result,
    });
  } else {
    const productIncentiveIN = new productIncentiveHere(req.body);
    // Save Allocation In Database
    productIncentiveIN
      .save(productIncentiveIN)
      .then((result) => {
        res.status(responseCodes.NEW_RESOURCE_CREATED).send({
          status: "OK",
          code: responseCodes.NEW_RESOURCE_CREATED,
          message: messages.NEW_RESOURCE_CREATED,
          data: result,
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

// Retrive all Allocations from the database.
exports.findAll = (req, res) => {
  const param = req.query;
  var condition = param;

  productIncentiveHere
    .find(condition)
    .then((result) => {
      if (!result) {
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
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// Find a single Allocation Model with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  productIncentiveHere
    .findById(id)
    .then((data) => {
      if (!data) {
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: messages.NO_DATA,
        });
      } else
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_RETRIVING_DATA,
          data: data,
        });
    })
    .catch((err) => {
      res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  DATA_BLOCK.endpoint = "/allocation/productIncentive/" + String(req.params.id);
  DATA_BLOCK.method = "PUT";
  // 204
  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);

    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.NO_VALID_DATA,
    });
  }

  const id = req.params.id;

  productIncentiveHere
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);

        res.status(responseCodes.BAD_REQUEST).send({
          status: "NOK",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_DATA,
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
