const router = require("express").Router();
// const bodyParser = require("body-parser");
// const validator = require("../helper/validate");
// const productParameters = require("../models/productParameterSchema");
const productParameterController = require("../controller/product.controller.js");
// const bcrypt = require("bcryptjs");
// const saltRounds = 10;
// var localStorage = require("localstorage");
// const ObjectId = require("mongodb").ObjectID;
// var async = require("async");
// // var userSchema = require('../models/userSchema')// var roomSchema = require('../models/roomSchema');
// var jsonQuery = require("json-query");
// const { mongo } = require("mongoose");

// Creating Product Param Module
router.post("/", productParameterController.create);

// Get Parameter
router.get("/", productParameterController.getAllParameters);

// Get parameter by Id
router.get("/:id", productParameterController.getParameterByID);

router.delete(
  "/:id",
  productParameterController.findDependency,
  productParameterController.delete
);

router.post(
  "/getConditional",
  productParameterController.getConditionalParameters
);

router.post("/getParameters", productParameterController.getParameter);

// Update parameter
router.put("/:id", productParameterController.update);

// Delete parameter by Id
//router.delete("/:id", productParameterController.delete);

// Delete all parameters
router.delete("/", productParameterController.deleteAll);

module.exports = router;
