const product = require("../models/productSchema.js");
const { responseCodes } = require("../../common/constant/constant.js");
const { messages } = require("../../common/constant/constant.js");
const Joi = require("joi");
const mongoose = require("mongoose");
const { aggregate } = require("../models/productSchema.js");

// Create dummy product
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        req.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
        });
        return;
    }

    var newProduct = new product(req.body);

    newProduct.save(newProduct).then((data) => {
        // productParameters
        res.status(responseCodes.SUCCESS_CODE).send({
            status: "OK",
            code: responseCodes.SUCCESS_CODE,
            message: messages.NEW_RESOURCE_CREATED,
            data: data,
        });
    });
};

// update dummy Product
exports.update = (req, res) => {
    // validation
    const id = req.params.id;
    const joiSchema = Joi.object({ _id: Joi.string() });
    // const result = joiSchema.validate(req.body._id);
    // delete req.body['_id'];

    product
        .findOneAndUpdate(id, req.body, { upsert: false, new: true })
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_UPDATING_DATA,
                data: result,
            });
        })
        .catch((err) => {
            res.status(responseCodes.FAILURE_CODE).send({
                status: "failed",
                code: responseCodes.FAILURE_CODE,
                message: messages.NO_DATA,
            });
        })
        .catch((error) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

exports.findAll = (req, res) => {
    //console.log("Inside Find-All");
    product
        .find({})
        .then((result) => {
            return res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: result,
            });
        })
        .catch((err) => {
            return res.status(responseCodes.FAILURE_CODE).send({
                status: "failed",
                code: responseCodes.FAILURE_CODE,
                message: messages.NO_DATA,
            });
        });
};

exports.findOne = (req, res) => {
    //console.log("Inside Find One");
    id = req.params.id;

    product
        .findById(id)
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: result,
            });
        })
        .catch((err) => {
            res.status(responseCodes.FAILURE_CODE).send({
                status: "failed",
                code: responseCodes.FAILURE_CODE,
                message: messages.FAILURE_RETRIVING_DATA,
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


// exports.findUnwindOne = (req, res) => {
//     const aggregate = product.aggregate([
//         { $project: { createdAt: 0, updatedAt: 0 } },
//         //{ $skip: 25 }
//     ]);
//     product.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.body._id) } }]).
//         unwind('variants').
//         exec((err, result) => {
//             // res.status(responseCodes.SUCCESS_CODE).send({
//             //     status: "OK",
//             //     code: responseCodes.SUCCESS_CODE,
//             //     message: messages.SUCCESS_RETRIVING_DATA,
//             //     data: result
//             // });
//             console.log(result);
//             res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//                 code: responseCodes.INTERNAL_SERVER_ERROR,
//                 data: result
//             });
//         })
//     // .catch(err => {
//     //     res.status(responseCodes.FAILURE_CODE).send({
//     //         status: "failed",
//     //         code: responseCodes.FAILURE_CODE,
//     //         message: messages.NO_DATA
//     //     });
//     // })
//     // .catch(err => {
//     //     res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//     //         status: "failed",
//     //         code: responseCodes.INTERNAL_SERVER_ERROR,
//     //         message: messages.SOMETHING_WENT_WRONG
//     //     });
//     // });
// }

exports.delete = (req, res) => {
    const id = req.params.id;
    product
        .findByIdAndRemove(id, { useFindAndModify: false })
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_DELETING_DATA,
                data: result,
            });
        })
        .catch((err) => {
            res.status(responseCodes.FAILURE_CODE).send({
                status: "failed",
                code: responseCodes.FAILURE_CODE,
                message: messages.NO_DATA,
            });
        })
        .catch((err) => {
            return res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

exports.deleteAll = (req, res) => {
    product
        .deleteMany({})
        .then((data) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_DELETING_DATA,
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
exports.findByProductId = (req, res) => {
    //id = req.params.id;
    // console.log("herererer");
    var id = req.query.productId;
    console.log(id);

    product
        .findOne({ productId: id })
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(responseCodes.FAILURE_CODE).send({
                status: "failed",
                code: responseCodes.FAILURE_CODE,
                message: messages.FAILURE_RETRIVING_DATA,
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