//controller here for 
const TransferHere = require("../models/transferSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
var counter = require("../../counter/models/counterSchema.js");

// Create and Persist a new transfer
// Create function
exports.create = async(req, res) => {

    //console.log("data validated");
    try {
        const transferModel = new TransferHere(req.body);
        // console.log(orderNoHere, );
        const transfer = await transferModel.save(function(err, result) {
            console.log(err);
            if (err) {
                console.log(err);
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "NOK",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    //message: messages.SOMETHING_WENT_WRONG,
                    message: err,
                });
            } else {
                counter.findByIdAndUpdate(
                    "transferSerialNumber", { $inc: { counter: 1 } }, { new: true, upsert: true },
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

                res.status(responseCodes.NEW_RESOURCE_CREATED).send({
                    status: "OK",
                    code: responseCodes.NEW_RESOURCE_CREATED,
                    message: messages.NEW_RESOURCE_CREATED,
                    data: req.body,
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "NOK",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: messages.SOMETHING_WENT_WRONG,
            //messages: e
        });
    }
};



// // Retrive all from the database.
// exports.findAll = (req, res) => {
//     //const transportCode = req.body.transportCode;
//     //console.log(req)
//     var page = req.query.page;
//     var limit = req.query.limit;
//     var sortBy = req.query.sortBy;
//     var sortOrder = req.query.sortOrder;
//     let sortOption = {}
//     sortOption[`${sortBy}`] = sortOrder
//     var options = {
//             page: page || 1,
//             limit: limit || 10,
//             sort: sortOption,
//         }
//         //console.log(options)
//     TransferHere.paginate({}, options)
//         //TransferHere.paginate({}, { "page": page || 1, "limit": limit || 10 })
//         .then((data) => {
//             res.status(responseCodes.SUCCESS_CODE).send({
//                 status: "OK",
//                 code: responseCodes.SUCCESS_CODE,
//                 message: messages.SUCCESS_RETRIVING_DATA,
//                 data: data,
//             });
//         })
//         .catch((err) => {
//             res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//                 status: "NOK",
//                 code: responseCodes.INTERNAL_SERVER_ERROR,
//                 message: messages.SOMETHING_WENT_WRONG,
//             });
//         });
// };

// Find a single Model with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    TransferHere.findById(id)
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
    if (!req.body) {
        return res.status(responseCodes.BAD_REQUEST).send({
            status: "NOK",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
        });
    }

    const id = req.params.id;

    TransferHere.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(responseCodes.BAD_REQUEST).send({
                    status: "NOK",
                    code: responseCodes.BAD_REQUEST,
                    message: messages.DATA_MISSING,
                });
            } else
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_UPDATING_DATA,
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