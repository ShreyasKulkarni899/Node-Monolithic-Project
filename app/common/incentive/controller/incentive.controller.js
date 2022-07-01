const db = require("../../models/dbSchema.js");
const incentive = require('../../discountMargineInentive/models/discountSchema.js')
const incentiveSchema = require('../models/incentiveSchema');
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
    DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
    createLog,
} = require("../../common/Logger/controller/LoggerController.js");

exports.test = async(req, res) => {
    console.log(req.body);
    res.json(req.body);
};

exports.addIncentiveSetting = async(req, res) => {
    DATA_BLOCK.endpoint = "/incentive/";
    DATA_BLOCK.method = "POST";
    const validationResult = require("../util/incentiveValidator.js");
    if (!validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "failed",
            code: responseCodes.VALIDATE_FAIL,
            message: messages.PROBLEM_IN_DATA,
        });
    } else {
        reqData = req.body;
        var newIncentive = incentive(reqData);
        newIncentive.save().then((savedObj) => {
            DATA_BLOCK.status = "OK";
            createLog(DATA_BLOCK);
            res.status(responseCodes.NEW_RESOURCE_CREATED).send({
                status: "OK",
                code: responseCodes.NEW_RESOURCE_CREATED,
                message: messages.NEW_RESOURCE_CREATED,
                data: data,
            });
        })
    }

};

exports.getAllIncentives = async(req, res) => {
    reqData = req.body;
    incentive.find(reqData)
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: data,
            });
        })
        .catch((err) => {
            console.log("getAllIncentive Error: ", err);
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

exports.updateIncentive = async(req, res) => {
    DATA_BLOCK.endpoint = "/incentive/" + String(req.params.id);
    DATA_BLOCK.method = "PUT";
    const validationResult = require("../util/incentiveValidator.js");
    if (!validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
        });
    } else {
        reqData = req.body;
        incentiveSchema.findOneAndUpdate({ _id: reqData._id }, reqData, { upsert: false, new: false })
            .then((updatedIncentive) => {
                DATA_BLOCK.status = "OK";
                createLog(DATA_BLOCK);
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "Successful",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_UPDATING_DATA,
                    data: updatedIncentive,
                });
            })
            .catch((err) => {
                DATA_BLOCK.status = "FAILED";
                createLog(DATA_BLOCK);
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "failed",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG,
                });
            })
    }

};