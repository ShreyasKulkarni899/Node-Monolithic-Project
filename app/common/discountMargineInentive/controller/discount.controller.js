const Discount = require('../models/discountSchema.js');
const generalLib = require('../../Lib/generalLib.js');
const { messages } = require("../../constant/constant");
const { responseCodes } = require("../../constant/constant");


exports.create = (req, res) => {
    console.log("In create");

    //Valiadte request
    if (!req.body) {
        res.status(responseCodes.BAD_REQUEST).send({
            status: "failed",
            code: responseCodes.BAD_REQUEST,
            message: messages.DATA_MISSING
        });
        return;
    }

    // Json Valiadator
    var result = require('../utils/discountValidatorSchema.js')(req.body);
    if (result) {
        console.log("ERRRRR", result);
        res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
            status: "failed",
            code: responseCodes.INTERNAL_SERVER_ERROR,
            message: result
        });
    } else {
        // create new discount
        const discount = new Discount(req.body);
        // save discount model in datavase
        discount
            .save(discount)
            .then(async(saveObj) => {
                const updatedInventoryProducts = await generalLib.updateDiscountInInventoryProduct(req.body);
                var resMsg = {
                    data: {
                        addDiscountStatus: saveObj,
                        updatedInventoryStatus: updatedInventoryProducts
                    }
                };
                res.status(responseCodes.SUCCESS_CODE).send({
                    status: "OK",
                    code: responseCodes.SUCCESS_CODE,
                    message: messages.NEW_RESOURCE_CREATED,
                    data: resMsg
                });
                console.log("data: " + JSON.stringify(saveObj));
            })
            .catch((err) => {
                console.log("error: " + err);
                res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                    status: 'OK',
                    code: responseCodes.INTERNAL_SERVER_ERROR,
                    message: messages.SOMETHING_WENT_WRONG
                });
            });
    }
};

// get all discounts
exports.findAll = (req, res) => {
    reqData = req.body;
    Discount.find({})
        .then(data => {
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_RETRIVING_DATA,
                data: data
            });
        })
        .catch((err) => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
        });
}

//update discount
exports.update = (req, res) => {
    const id = req.params.id;
    Discount.findByIdAndUpdate(id, req.body, { upsert: false, new: false })
        .then(async(data) => {
            const updateInvenStatus = await generalLib.updateDiscountInInventoryProduct(req.body);
            const resMsg = {
                "data": {
                    "updateInventoryStatus": updateInvenStatus,
                    "updateDisocuntStatus": data
                }
            };
            res.status(responseCodes.SUCCESS_CODE).send({
                status: "OK",
                code: responseCodes.SUCCESS_CODE,
                message: messages.SUCCESS_UPDATING_DATA
            });
        })
        .catch(err => {
            res.status(responseCodes.INTERNAL_SERVER_ERROR).send({
                status: "failed",
                code: responseCodes.INTERNAL_SERVER_ERROR,
                message: messages.SOMETHING_WENT_WRONG
            });
        });
}