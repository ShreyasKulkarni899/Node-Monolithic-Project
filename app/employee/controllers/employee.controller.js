const UserSchema = require("../../common/user/models/userShema.js");
const db = require("../../common/models/dbSchema.js");
const Employee = require("../../employee/models/employeeSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
  DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
  createLog,
} = require("../../common/Logger/controller/LoggerController.js");

// Create and Persist a new Employee Model
// Create function
exports.create = (req, res) => {
  DATA_BLOCK.endpoint = "/employee/";
  DATA_BLOCK.method = "POST";
  var result = require("../utils/employeeValidateSchema.js")(req.body);

  // Validation of request
  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);

    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
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
    const employee = new Employee(req.body);
    // Save  Employee Model In Database
    employee
      .save(employee)
      .then((data) => {
        DATA_BLOCK.status = "OK";
        createLog(DATA_BLOCK);

        var userData = {};
        const reqData = req.body;

        userData["userType"] = "customer";

        if (reqData.personalDetails && reqData.personalDetails.firstName) {
          userData["userName"] =
            reqData.personalDetails && reqData.personalDetails.lastName
              ? reqData.personalDetails.firstName +
                reqData.personalDetails.lastName
              : reqData.personalDetails.firstName;
        } else {
          userData["userName"] = "undefined";
        }

        if (reqData.personalDetails && reqData.personalDetails.firstName) {
          var name = reqData.personalDetails.firstName;
          userData["userEmail"] = name.toLowerCase() + "@email.com";

          userData["userPassword"] = name.toLowerCase() + "5678";
        } else {
          userData["userEmail"] = "undefined";
          userData["userPassword"] = "undefined";
        }

        if (reqData.workDetails && reqData.workDetails.position) {
          userData["userRole"] = reqData.workDetails.position;
        } else {
          userData["userRole"] = "undefined";
        }

        const user = new UserSchema(userData);
        user
          .save(user)
          .then((userData) => {
            DATA_BLOCK.status = "SUCCESS";
            createLog(DATA_BLOCK);

            res.status(responseCodes.SUCCESS_CODE).send({
              status: "OK",
              code: responseCodes.SUCCESS_CODE,
              messages: messages.DATA_SAVE,
              data: data,
            });
          })
          .catch((err) => {
            console.log(err.message);
            return res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
              status: "NOK",
              code: responseCodes.INTERNAL_SERVER_ERROR,
              message: messages.SOMETHING_WENT_WRONG,
            });
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
  }
};

// Retrive all  Employee Model from the database.
exports.findAll = (req, res) => {
  // const employeeid = req.body.employeeid;
  // var condition = employeeid ? { employeeid: { $regex: new RegExp(employeeid), $options: "i" } } : {};

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

  Employee.paginate({}, options)
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
        status: "NOK",
        code: responseCodes.INTERNAL_SERVER_ERROR,
        message: messages.SOMETHING_WENT_WRONG,
      });
    });
};

// Find a single  Employee Model with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Employee.findById(id)
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

// Update a  Employee Model by the id in the request
exports.update = (req, res) => {
  DATA_BLOCK.endpoint = "/employee/" + String(req.params.id);
  DATA_BLOCK.method = "PUT";

  if (!req.body) {
    DATA_BLOCK.status = "FAILED";
    createLog(DATA_BLOCK);
    return res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.NO_VALID_DATA,
    });
  }

  const id = req.params.id;

  Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Employee.findByIdAndRemove(id, { useFindAndModify: false })
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
  Employee.deleteMany({})
    .then((data) => {
      res.status(responseCodes.SUCCESS_CODE).send({
        status: "OK",
        code: responseCodes.SUCCESS_CODE,
        messages: `${data.deletedCount},${messages.SUCCESS_DELETING_DATA}`,
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
