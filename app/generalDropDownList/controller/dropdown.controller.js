// const dropdownListParameter = require("../models/dropdownListSchema.js");
const DropdownList = require("../models/dropdownListSchema.js");
const { messages } = require("../../common/constant/constant");
const { responseCodes } = require("../../common/constant/constant");
// const db = require("../../common/models/dbSchema.js");
// const DropDownList = db.dropdownList;
// const responseCode = require('../helper/responseCode');
// const { DUPLICATE } = require('../helper/responseCode');

//Create and Save a new DropdownList
exports.create = (req, res) => {
    var result = require("../utils/dropdownListValidateSchema.js")(req.body);
    // Validate request
    if (!req.body) {
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING
        });
        return;
    }

    // Validate Schema data
    if (result) {
        res.status(responseCodes.VALIDATE_FAIL).send({
            status: "failed",
            code: responseCodes.VALIDATE_FAIL,
            message: result
        })
    } else {
        DropdownList.find({ title: req.body.title })
            .then((result) => {
                if (result.length > 0) {
                    // console.log("pastRecord", result)
                    // res.status(responseCode.DUPLICATE).json({ message: "Duplicate Entry" });
                    res.status(responseCodes.BAD_REQUEST).send({
                        status: "failed",
                        code: responseCodes.BAD_REQUEST,
                        message: messages.DUPLICATE,
                    });
                } else {
                    const newDropdown = DropdownList(req.body);
                    newDropdown.save()
                        .then((result) => {
                            // console.log(result);
                            res.status(responseCodes.NEW_RESOURCE_CREATED).send({
                                status: 'OK',
                                code: responseCodes.NEW_RESOURCE_CREATED,
                                data: result
                            })
                            // res.status(responseCode.SUCCESS).json(result)
                        })
                        .catch((err) => {
                            // console.log(err);
                            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                                status: "failed",
                                code: responseCodes.INTERNAL_SERVER_ERROR,
                                "error": messages.SOMETHING_WENT_WRONG
                            });
                            // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
                        });
                }
            }).catch((err) => {
                // console.log(err);
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: "failed",
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG
                });
                // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
            });
        // } catch {
        //     // console.log(err);
        //     res.status(500).json({ "error": err });
        //     // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });

        // }
        // var dropdownObj = new dropdownListParameter(req.body);
        // dropdownObj
        //     .save(dropdownObj)
        //     .then((data) => {
        //         res.send(data);
        //     })
        //     .catch((err) => {
        //         res.status(500).send({ message: err.message || "Error while saving into datavase" });
        //     });
        // }
    };
};

// Retrieve all DropDownList from the database.
// exports.findAll = (req, res) => {
//     DropDownList.find({ title: req.body.title, isDeleted: false })
//         .then((result) => {
//             console.log(result);
//             res.status(responseCode.SUCCESS).json(result);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
//         })
// const title = req.query.title;
// var condition = title ? { title: { $regx: new RegExp(title), $option: "i" } } : {};

// DropDownList.find(condition)
//     .then(data => {
//         res.send(data);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message:
//                 err.message || "Some error occured while retrieving DropDownList."
//         });
//     });
// };

//Find a single DropDownList
exports.findOne = (req, res) => {
    // const id = req.params.id;
    DropdownList.find({ title: req.query.title, isDeleted: false })
        .then((result) => {
            // console.log(result);
            res.status(responseCodes.SUCCESS_CODE).send({
                status: 'OK',
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: result
            });
            // res.status(responseCode.SUCCESS).json(result);
        })
        .catch((err) => {
            // console.log(err);
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
            // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
        })
};

// Udate DropDownList By ID in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.NO_ID_FOUND,
        });
    }

    //Json Validator
    var result = require("../utils/dropdownListValidateSchema")(req.body);
    if (result) {
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: result,
        });
    }

    const id = req.params.id;
    DropdownList.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((result) => {
            if (!result) {
                res.status(responseCodes.BAD_REQUEST).send({
                    status: "failed",
                    code: responseCodes.BAD_REQUEST,
                    message: messages.NO_ID_FOUND
                });
                // console.log(result);
            } else {
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.SUCCESS_UPDATING_DATA,
                    data: result
                });
            }
            // res.status(responseCode.SUCCESS).json(result);
        })
        .catch((err) => {
            // console.log(err);
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
            // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
        });
};
// exports.update = (req, res) => {
//     var result = require("../utils/dropdownListValidateSchema.js")(req.body);
//     if (!result) {
//         return res.status(400).send({
//             message: "This Data cannot udated!"
//         });

//     } else {

//         const id = req.params.id;

//         DropDownList.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//             .then(data => {
//                 if (!data) {
//                     res.status(404).send({
//                         message: `Cannot update DropDownList with id=${id}. Maybe DropDownList was not found!`
//                     });
//                 } else res.send({ message: "DropDownList was updated successfully." });
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     message: "Error updating DropDownList with id=" + id
//                 });
//             });
//     }


// Delete a DropDownList with the specified id in the request 
exports.delete = (req, res) => {
    // console.log("ala");
    const id = req.params.id;
    DropdownList.findByIdAndRemove(id, { useFindAndModify: false })
        // DropdownList.findOneAndUpdate({ _id: req.body._id }, req.body, { upsert: false, new: true })
        .then((result) => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_DELETING_DATA
            });
            // console.log(result);
            // res.status(200).json(result);
            // res.status(responseCode.SUCCESS).json(result);
        })
        .catch((err) => {
            // console.log(err);
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
            // res.status(responseCode.INTERNAL_SERVER_ERROR).json({ "error": err });
        })
    // const id = req.params.id;

    // DropDownList.findByIdAndRemove(id, { useFindAndModify: false })
    //     .then(data => {
    //         if (!data) {
    //             res.status(404).send({
    //                 message: `Cannot delete DropDownList with id=${id}. Maybe DropDownList was not found!`
    //             });
    //         } else {
    //             res.send({
    //                 message: "DropDownList was deleted successfully!"
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: "Could not delete DropDownList with id=" + id
    //         });
    //     });
};

// Delete all DropDownList from the database.
exports.deleteAll = (req, res) => {
    DropdownList.deleteMany({})
        .then(data => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_DELETING_DATA
            });
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
        });
};