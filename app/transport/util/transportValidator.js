const mongoose = require('mongoose');
const Joi = require("joi");

function transportValidator() {
    const transportSchema = Joi.object({

        transportCode: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        gender: Joi.string().allow(""),
        ownersContactNo: Joi.string().required(),
        email: Joi.string().allow(""),
        transportName: Joi.string().required(),
        status: Joi.boolean().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().allow(""),
        gst: Joi.string().allow(""),
        panNo: Joi.string().allow(""),

        igst: Joi.boolean().default(false),

        contactDetails: Joi.array().items({
            operatorsName: Joi.string().required(),
            operatorMobile: Joi.string().required(),
            faxNo: Joi.string().allow("")
        }),
    });
    const result = transportSchema.validate();

    return result.error ? result.error.details[0].message : false;
}
//exporting
module.exports = transportValidator;