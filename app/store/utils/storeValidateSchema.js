const Joi = require('joi');

module.exports = (data) => {
    const JoiSchema = Joi.object({
        logoUrl: Joi.string().required(),
        storeName: Joi.string().required(),
        proprietorName: Joi.string().required(),
        gstNo: Joi.string().required(),
        emailAddress: Joi.string().required(),
        contact: Joi.string().required(),
        address: Joi.object().keys({
            firstLine: Joi.string().required(),
            secondLine: Joi.string().allow(""),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            state: Joi.string().allow(""),
            country: Joi.string().allow(""),
        }),
        taxMethod: Joi.string().required(),
        storeCustomField1: Joi.string().allow(""),
        storeCustomField2: Joi.string().allow(""),
        barcodePrefix: Joi.string().required(),
        additionalDescription: Joi.string().allow(""),
        status: Joi.boolean().default(false),
    }).options({ abortEarly: false });

    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
}

