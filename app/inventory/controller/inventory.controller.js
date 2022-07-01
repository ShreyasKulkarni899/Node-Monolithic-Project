const db = require("../../common/models/dbSchema.js");
const inventorySchema = require("../models/inventorySchema.js");
const counterLib = require("../../common/Lib/counterLib");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
// const responseCode = require('../helper/responseCode');
const {
    DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
    createLog,
} = require("../../common/Logger/controller/LoggerController.js");

exports.test = async(req, res) => {
    //console.log(req.body);
    res.json(req.body);
};

exports.addInventoryProduct = async(req, res) => {
    DATA_BLOCK.endpoint = "/inventory/";
    DATA_BLOCK.method = "POST";
    reqData = req.body;
    counterLib.getNextSequenceValue("billno", function(barcodeCount) {
        console.log("return value from function " + JSON.stringify(barcodeCount));
        var storeName = reqData.storeName.slice(0, 1);
        // console.log();
        var currentTime = new Date()
        var year = currentTime.getFullYear()
            // var vardate = currentTime.getVarDate()
        var month = (currentTime.getMonth() + 1).toString()
        var barcode = storeName + year.toString().slice(2, 4) + "M" + month.padStart(3 - month.length, "0") + "S" + barcodeCount.padStart(8 - barcodeCount.length, "0")
            // var newInventoryProduct = new inventoryProduct(reqData);
        console.log(barcode);
        // var savedObj = await newInventoryProduct.save();
        res.json(barcode);
        DATA_BLOCK.status = "OK";
        createLog(DATA_BLOCK);
    });
    // console.log("data: " + JSON.stringify(savedObj));
    // res.json(savedObj);
};

exports.getInventoryProducts = async(req, res) => {
    console.log("Request string: " + JSON.stringify(req.body));
    reqData = req.body;
    try {
        inventorySchema.find({ $text: { $search: reqData.searchString } }, async(err, result) => {
            if (err) throw err;
            if (result) {
                return res.status(responseCodes.SUCCESS_CODE).send({
                    status: "Successful",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_UPDATING_DATA,
                    data: data,
                });
            } else {
                return res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            }
        });
    } catch (e) {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "failed",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
        });
    }
    //console.log(result);
    // // productParameters
    // res.json(result);
};

exports.updateInventoryProducts = async(req, res) => {
    DATA_BLOCK.endpoint = "/inventory/" + String(req.body._id);
    DATA_BLOCK.method = "PUT";
    console.log(req.body._id);
    const reqData = JSON.parse(JSON.stringify(req.body));
    var validationResult = require("../util/inventoryValidator.js")(req.body);
    if (!validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "failed",
            code: responseCodes.VALIDATE_FAIL,
            message: "validation failed",
        });
    } else {
        try {
            // console.log('request id :'+JSON.stringify(req.body.updateData.loginDetails.empUserName ));
            // const employeeId = new mongo.ObjectID(req.body._id);
            //console.log("before try");
            // console.log(reqData);
            delete reqData['_id'];
            // console.log(employeeId);
            console.log(reqData);
            inventorySchema.findOneAndUpdate({ _id: req.body._id }, reqData, { upsert: false, new: true }, function(error, result) {
                if (error) {
                    DATA_BLOCK.status = "FAILED";
                    createLog(DATA_BLOCK);
                    res.status(responseCodes.BAD_REQUEST).send({
                        status: "failed",
                        code: responseCodes.BAD_REQUEST,
                        message: messages.DATA_MISSING,
                    });
                    // throw error;
                } else if (!result) {
                    DATA_BLOCK.status = "FAILED";
                    createLog(DATA_BLOCK);
                    res.status(responseCodes.FAILURE_CODE).send({
                        status: "failed",
                        code: responseCodes.FAILURE_CODE,
                        message: messages.NO_DATA,
                    });
                } else {
                    DATA_BLOCK.status = "OK";
                    createLog(DATA_BLOCK);
                    res.status(responseCodes.SUCCESS_CODE).send({
                        status: "Successful",
                        code: responseCodes.SUCCESS_CODE,
                        message: messages.SUCCESS_UPDATING_DATA,
                        data: result,
                    });
                }
            });
        } catch (error) {
            DATA_BLOCK.status = "FAILED";
            createLog(DATA_BLOCK);
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        }
    }
};

exports.getAllInventoryProducts = async(req, res) => {
    // console.log("Request string: " + JSON.stringify(req.body));
    reqData = req.body;
    try {
        inventorySchema.find({}, async(err, result) => {
            if (err) throw err;
            if (result) {
                return res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_RETRIVING_DATA,
                    data: result,
                });
            } else {
                return res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            }
        });
    } catch (e) {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "failed",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
        });
    }
    // console.log(result);
    // // productParameters
    // res.json(result);
};

exports.getInventoryProductsById = async(req, res) => {
    console.log("Request string: " + JSON.stringify(req.body));
    reqData = req.body._id;
    try {
        inventorySchema.findOne({ _id: reqData }, async(err, result) => {
            if (err) throw err;
            if (result) {
                return res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_RETRIVING_DATA,
                    data: result,
                });
            } else {
                return res.status(responseCodes.FAILURE_CODE).send({
                    status: "failed",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            }
        });
    } catch (e) {
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "failed",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
        });
    }
    // console.log(result);
    // // productParameters
    // res.json(result);
};

exports.getProductByLocation = async(req, res) => {
    var reqData = req.body;
    inventorySchema.find(reqData.query)
        .then((result) => {
            if (result.length == 0) {
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
        }).catch((err) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};