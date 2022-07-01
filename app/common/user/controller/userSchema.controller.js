const mongoose = require("mongoose");
const UserSchema = require("../models/userShema.js")(mongoose);
const jwt = require("jsonwebtoken");
const { messages } = require("../../constant/constant");
const { responseCodes } = require("../../constant/constant");
const dotenv = require("dotenv");
const log = require("../../log/user/controller/logUser.controller.js");
dotenv.config();

// Register Function
exports.register = (req, res) => {
  var result = require("../utils/userSchemaValidate.js")(req.body);

  if (!req.body) {
    // If body is empty
    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
  }

  // Data validation of request data
  if (!result) {
    res.status(responseCodes.VALIDATE_FAIL).send({
      status: "NOK",
      code: responseCodes.VALIDATE_FAIL,
      message: messages.PROBLEM_IN_DATA,
    });
  } else {
    // Checking if user is already present
    UserSchema.findOne(req.body).then((resultData) => {
      // If present
      if (resultData !== null) {
        res.status(responseCodes.VALIDATE_FAIL).send({
          status: "NOK",
          code: responseCodes.FAILURE_CODE,
          message: messages.UserFound,
        });
      } else {
        // Not present - creating a new user
        const user = new UserSchema(req.body);
        user
          .save(user)
          .then((data) => {
            // Generating new token
            jwt.sign(
              { data },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "72h" },
              (err, token) => {
                res.status(responseCodes.SUCCESS_CODE).send({
                  status: "OK",
                  code: responseCodes.SUCCESS_CODE,
                  message: messages.TOKEN_GENERATED,
                  token: token,
                  data: data,
                });
              }
            );
            log.create({ userType: data.userType, userName: data.userName });
          })
          .catch((err) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
              status: "NOK",
              code: responseCodes.INTERNAL_SERVER_ERROR,
              message: messages.SOMETHING_WENT_WRONG,
            });
          });
      }
    });
  }
};

// Login Function
exports.login = (req, res) => {
  // Validating Data
  if (req.body === null) {
    res.status(responseCodes.BAD_REQUEST).send({
      status: "NOK",
      code: responseCodes.BAD_REQUEST,
      message: messages.DATA_MISSING,
    });
    return;
  } else {
    // Authenticating User
    UserSchema.find({
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
    })
      .then((data) => {
        const isEmpty = Object.keys(data).length === 0;
        // If User Not Present
        if (isEmpty) {
          res.status(responseCodes.SUCCESS_CODE).send({
            status: "NOK",
            code: responseCodes.SUCCESS_CODE,
            data: data,
            message: messages.NO_DATA,
          });
        } else {
          // Creating new token
          jwt.sign(
            { data },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" },
            (err, token) => {
              res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.TOKEN_GENERATED,
                token: token,
                data: data,
              });
            }
          );
        }
      })
      .catch((err) => {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
          status: "NOK",
          code: responseCodes.INTERNAL_SERVER_ERROR,
          message: messages.SOMETHING_WENT_WRONG,
        });
      });
  }
};

exports.getUsers = (req, res) => {
  UserSchema.find().then((data) => {
    res.status(responseCodes.SUCCESS_CODE).send({
      status: "OK",
      code: responseCodes.SUCCESS_CODE,
      message: messages.SUCCESS_RETRIVING_DATA,
      data: data,
    });
  });
};
