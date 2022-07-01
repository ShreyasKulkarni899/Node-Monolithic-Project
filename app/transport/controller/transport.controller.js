//controller here for transport
const db = require("../../common/models/dbSchema");
const TransportHere = require("../models/transportSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
const {
    DATA_BLOCK,
} = require("../../common/Logger/constant/ResponseObjects.js");
const {
    createLog,
} = require("../../common/Logger/controller/LoggerController.js");

// Create and Persist a new customer
// Create function
exports.create = async(req, res) => {
    DATA_BLOCK.endpoint = "/transport/";
    DATA_BLOCK.method = "POST";

    //console.log("IN create", req.body);
    // Validation of request
    var validationResult = require("../util/transportValidator.js")(req.body);
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

    // Creating customer
    if (validationResult) {
        DATA_BLOCK.status = "FAILED";
        createLog(DATA_BLOCK);
        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "NOK",
            code: responseCodes.VALIDATE_FAIL,
            message: validationResult,
        });
    } else {
        const transportObj = new TransportHere(req.body);
        const transportCodeHere = req.body.transportCode;
        console.log({ "transportCode": transportCodeHere })
        const uniqueFlag = await TransportHere.findOne({ "transportCode": transportCodeHere });
        console.log(uniqueFlag);
        if (uniqueFlag) {
            return res.status(responseCodes.BAD_REQUEST).send({
                status: "NOK",
                code: responseCodes.BAD_REQUEST,
                message: messages.TRANSPORT_CODE_PRESENT,

            });
        }
        // Save Transport In Database
        transportObj
            .save(transportObj)
            .then((data) => {
                DATA_BLOCK.status = "OK";
                createLog(DATA_BLOCK);
                res.status(responseCodes.NEW_RESOURCE_CREATED).send({
                    status: "OK",
                    code: responseCodes.NEW_RESOURCE_CREATED,
                    message: messages.NEW_RESOURCE_CREATED,
                    data: data,
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
}

// Retrive all from the database.
exports.findAll = (req, res) => {
    //const transportCode = req.body.transportCode;
    //console.log(req)
    var page = req.query.page;
    var limit = req.query.limit;
    var sortBy = req.query.sortBy;
    var sortOrder = req.query.sortOrder;
    let sortOption = {}
    sortOption[`${sortBy}`] = sortOrder
    var options = {
            page: page || 1,
            limit: limit || 10,
            sort: sortOption,
        }
        //console.log(options)
    TransportHere.paginate({}, options)
        //TransportHere.paginate({}, { "page": page || 1, "limit": limit || 10 })
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

// Find a single Model with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    TransportHere.findById(id)
        .then((data) => {
            if (!data)
                res.status(responseCodes.FAILURE_CODE).send({
                    status: "NOK",
                    code: responseCodes.FAILURE_CODE,
                    message: messages.NO_DATA,
                });
            else res.status(responseCodes.SUCCESS_CODE).send({
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

// Update a transport by the id in the request
exports.update = (req, res) => {
    DATA_BLOCK.endpoint = "/transport/" + String(req.params.id);
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

    TransportHere.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

// Delete a Transport with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    TransportHere.findByIdAndRemove(id, { useFindAndModify: false })
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

// Delete all Transport from the database.
exports.deleteAll = (req, res) => {
    TransportHere.deleteMany({})
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