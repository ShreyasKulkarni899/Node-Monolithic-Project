const productParameters = require("../models/productParameterSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const { findById } = require("../models/productParameterSchema.js");
const {
  DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
  createLog,
} = require("../../common/Logger/controller/LoggerController.js");

// Create Function
exports.create = (req, res) => {
  DATA_BLOCK.endpoint = "/productparameter/";
  DATA_BLOCK.method = "POST";
  var result = require("../utils/productParameterValidateSchema.js")(req.body);

  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);
    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
  }

  // Validation
  if (result) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);

    res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: result,
    });
  } else {
    // Save function
    const empObj = new productParameters(req.body);
    empObj
      .save(empObj)
      .then((data) => {
        if (data === null) {
          DATA_BLOCK.status = "FAILED";
          createLog(DATA_BLOCK);

          res.status(responseCodes.FAILURE_CODE).send({
            status: "NOK",
            code: responseCodes.FAILURE_CODE,
            message: messages.NO_DATA,
          });
        } else {
          DATA_BLOCK.status = "OK";
          createLog(DATA_BLOCK);

          res.status(responseCodes.NEW_RESOURCE_CREATED).send({
            status: "OK",
            code: responseCodes.NEW_RESOURCE_CREATED,
            message: messages.NEW_RESOURCE_CREATED,
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
  }
};

// Retrive all Products.
exports.getAllParameters = (req, res) => {
  const params = req.query;
  var condition = params;
  //console.log(condition);

  productParameters
    .find(condition)
    .then((data) => {
      if (data === null) {
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

// Find a single Allocation Model with an id
exports.getParameterByID = (req, res) => {
  const id = req.params.id;

  productParameters
    .findById(id)
    .then((data) => {
      if (!data) {
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

exports.getConditionalParameters = async (req, res) => {
  //console.log("data: " + req.body.conditions);
  let query = req.body.conditions;
  // query.status=false;
  try {
    var conditionalList = await productParameters.distinct(
      req.body.reqList,
      query
    );
    result = {
      conditionalList: conditionalList,
    };

    if (result === null) {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "NOK",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    } else {
      //console.log(result);
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: result,
      });
    }
  } catch (err) {
    //console.log(err);
    res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
      status: "NOK",
      code: responseCodes.INTERNAL_SERVER_ERROR,
      message: messages.SOMETHING_WENT_WRONG,
    });
  }
};

exports.getParameter = async (req, res) => {
  //console.log("data: " + req.body.conditions);
  let query = req.body.conditions;
  // query.status=false;
  try {
    var unConditionalList = await productParameters.distinct(
      req.body.reqList,
      query
    );
    result = {
      unConditionalList: unConditionalList,
    };
    if (result === null) {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "NOK",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    } else {
      //console.log(result);
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        message: messages.SUCCESS_RETRIVING_DATA,
        data: result,
      });
    }
  } catch (err) {
    //console.log(err);
    res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
      status: "NOK",
      code: responseCodes.INTERNAL_SERVER_ERROR,
      message: messages.SOMETHING_WENT_WRONG,
    });
  }
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  DATA_BLOCK.endpoint = "/productparameter/" + String(req.params.id);
  DATA_BLOCK.method = "PUT";
  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);
    return res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
  }

  const id = req.params.id;

  productParameters
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.BAD_REQUEST).send({
          status: "NOK",
          code: responseCodes.BAD_REQUEST,
          message: messages.DATA_MISSING,
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

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  productParameters
    .findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(responseCodes.BAD_REQUEST).send({
          status: "NOK",
          code: responseCodes.BAD_REQUEST,
          message: messages.NO_DATA,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          message: messages.SUCCESS_DELETING_DATA,
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

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  productParameters
    .deleteMany({})
    .then((data) => {
      if (data === null) {
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: messages.NO_DATA,
        });
      } else {
        res.status(responseCodes.SUCCESS_CODE).send({
          status: "OK",
          code: responseCodes.SUCCESS_CODE,
          messages: `${data.deletedCount},${messages.SUCCESS_DELETING_DATA}`,
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

exports.findDependency = (req, res, next) => {
  const id = req.params.id;
  productParameters
    .findById(id)
    .then((data) => {
      if (!data) {
        count = 0;
        res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: messages.NO_DATA,
        });
      } else {
        switch (data.docType) {
          case "productItem":
            var productItemCondition = {
              department: data.department,
              productItem: data.productItem,
            };
            findByCondition(productItemCondition, next, res, req);
            break;

          case "productType":
            const productTypeCondition = {
              department: data.department,
              productItem: data.productItem,
              productType: data.productType,
            };
            findByCondition(productTypeCondition, next, res, req);
            break;

          case "brand":
            var brandCondition = {
              department: data.department,
              productItem: data.productItem,
              productType: data.productType,
              brand: data.brand,
            };
            findByCondition(brandCondition, next, res, req);
            break;

          case "designNumber":
            var designNumberCondition = {
              department: data.department,
              productItem: data.productItem,
              productType: data.productType,
              brand: data.brand,
              designNumber: data.designNumber,
            };
            findByCondition(designNumberCondition, next, res, req);
            break;

          default:
            let defaultCondition = {};
            defaultCondition[`${data.docType}`] = data[data.docType];
            findByCondition(defaultCondition, next, res, req);
            break;
        }
      }
    })
    .catch((err) => {
      res.send({ messages: "Error" });
    });
};

function findByCondition(condition, next, res, req) {
  productParameters.find(condition).then((data) => {
    data.length > 1
      ? res.status(responseCodes.FAILURE_CODE).send({
          status: "NOK",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: `${data.length},${messages.DEPENDENCY_FOUND}`,
        })
      : next();

    if (data === null) {
      res.status(responseCodes.FAILURE_CODE).send({
        status: "NOK",
        code: responseCodes.FAILURE_CODE,
        message: messages.NO_DATA,
      });
    }
  });
}

exports.demo = (req, res) => {
  res.json({ Demo: "Demo" });
};
