const db = require("../../common/models/dbSchema.js");
const Suppliers = require("../models/supplierSchema.js");
const { responseCodes } = require("../../common/constant/constant");
const { messages } = require("../../common/constant/constant");
// const Suppliers = db.supplier;

//Create and Save a new Supplier
exports.create = (req, res) => {
    //console.log("IN CReate");
    // Validate request
    if (!req.body) {
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.NO_DATA,
        });
        return;
    }

    //Json Validator
    var result = require("../utils/supplierValidateSchema.js")(req.body);
    if (result) {
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: result,
        });
    } else {
        // Create new Supplier 


        const supplier = new Suppliers(req.body);
        // Save  Supplier Model In Database
        supplier
            .save(supplier)
            .then((data) => {
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "Successful",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_UPDATING_DATA,
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

        // Create new Supplier 
        // const supplier = new Suppliers(
        //     {
        //         supplierDetails: {
        //             supplierCode: req.body.supplierDetails.supplierCode,
        //             supplierName: req.body.supplierDetails.supplierName,
        //             supplierDiscount: req.body.supplierDetails.supplierDetails,
        //             gstNo: req.body.supplierDetails.gstNo,
        //             panNo: req.body.supplierDetails.panNo,
        //             igst: req.body.supplierDetails.igst,
        //         },
        //         selectStore: req.body.selectStore,
        //         supplierAddress: {
        //             firstLine: req.body.supplierAddress.firstLine,
        //             secondLine: req.body.supplierAddress.secondLine,
        //             city: req.body.supplierAddress.city,
        //             postalCode: req.body.postalCode,
        //             state: req.body.supplierAddress.state,
        //             country: req.body.supplierAddress.country,
        //         },
        //         bankDetails: req.body.bankDetails,
        //         openingBalance: req.body.openingBalance,
        //         defineMyOwnCode: req.body.defineMyOwnCode,
        //         preferredSupplier: req.body.preferredSupplier,
        //         paymentTerms: req.body.paymentTerms,
        //         RepresentativeDetials: {
        //             firstName: req.body.RepresentativeDetials.firstName,
        //             lastName: req.body.RepresentativeDetials.lastName,
        //             contacts: req.body.RepresentativeDetials.contacts
        //         },
        //         faxNo: req.body.faxNo,
        //         website: req.body.website,
        //         email: req.body.email,
        //         photoUrl: req.body.photoUrl,
        //         referedBy: req.body.referedBy,
        //         percentageCommision: req.body.percentageCommision,
        //         status: req.body.status,
        //         visibility: req.body.visibility,
        //         ts_l: req.body.ts_l
        //     });

        // //save supplier in the database
        // console.log("Supplier", supplier);
        // supplier
        //     .save(supplier)
        //     .then(data => {
        //         res.send(data);
        //     })
        //     .catch(err => {
        //         res.status(500).send({
        //             message:
        //                 err.message || "Some error occured while creating a Supplier."
        //         });
        //     });
    }
};

// Retrieve all Suppliers from the database.
exports.findAll = (req, res) => {
    // const supplierCode = req.query.supplierCode;
    // var condition = supplierCode ? { supplierCode: { $regx: new RegExp(supplierCode), $option: "i" } } : {};

    const params = req.query;
    var condition = params;

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

    Suppliers.paginate({ condition }, options)
        .then(data => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "Successful",
                code: responseCodes.SUCCESS_CODE,
                message: messages.DATA_FETCHED,
                data: data,
            });
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

// Find a single Supplier
exports.findOne = (req, res) => {
    const storeId = req.query.storeId;
    // const params = req.query;
    const id = req.query.id;
    var condition = {};
    if (id) {
        // id = req.params.id;
        condition = { "_id": id };
    } else if (storeId) {
        condition = { "selectStore.storeId": storeId };
    }
    Suppliers.find(condition)
        // Suppliers.find({ "selectStore.storeId": storeId })
        .then(data => {
            if (!data)
                res.status(responseCodes.BAD_REQUEST).send({
                    status: "failed",
                    code: responseCodes.BAD_REQUEST,
                    message: messages.NO_ID_FOUND,
                });
            else res.status(responseCodes.SUCCESS_CODE).send({
                status: "Successful",
                code: responseCodes.SUCCESS_CODE,
                message: messages.DATA_FETCHED,
                data: data,
            });
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};
// //find the single supplier with using the id 
// exports.findById = (req, res) => {
//     const id = req.query.id;

//     Suppliers.find({ "selectStore.storeId": storeId })
//         .then(data => {
//             if (!data)
//                 res.status(responseCodes.BAD_REQUEST).send({
//                     status: "failed",
//                     code: responseCodes.BAD_REQUEST,
//                     message: messages.NO_ID_FOUND,
//                 });
//             else res.status(responseCodes.SUCCESS_CODE).send({
//                 status: "Successful",
//                 code: responseCodes.SUCCESS_CODE,
//                 message: messages.DATA_FETCHED,
//                 data: data,
//             });
//         })
//         .catch(err => {
//             res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
//                 status: "failed",
//                 code: responseCodes.INTERNAL_SERVER_ERROR,
//                 message: messages.SOMETHING_WENT_WRONG,
//             });
//         });
// };
// Udate Supplier By Id in the request 
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING,
        });
    }

    //Json Validator
    var result = require("../utils/supplierValidateSchema.js")(req.body);
    if (result) {
        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "failed",
            code: responseCodes.VALIDATE_FAIL,
            message: result,
        });
    } else {
        const id = req.params.id;

        Suppliers.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(responseCodes.BAD_REQUEST).send({
                        status: "failed",
                        code: responseCodes.BAD_REQUEST,
                        message: messages.NO_ID_FOUND,
                    });
                } else
                    res.status(responseCodes.SUCCESS_CODE).send({
                        status: "Successful",
                        code: responseCodes.SUCCESS_CODE,
                        message: messages.SUCCESS_UPDATING_DATA,
                        data: data,
                    });
            })
            .catch(err => {
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "failed",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG,
                });
            });
    }

};

// Delete a Supplier with the specified id in the request 
exports.delete = (req, res) => {
    const id = req.params.id;

    Suppliers.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(responseCodes.BAD_REQUEST).send({
                    status: "failed",
                    code: responseCodes.BAD_REQUEST,
                    message: messages.NO_ID_FOUND,
                });
            } else {
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "Successful",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_DELETING_DATA,
                    data: data,
                });
            }
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Suppliers.deleteMany({})
        .then(data => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: `${data.deletedCount} Store were deleted successfully!`,
                data: data,
            });
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG,
            });
        });
};