const Joi = require('joi');

module.exports = (data) => {
    const JoiSchema = Joi.object({
        supplierDetails: Joi.object().keys({
            supplierCode: Joi.string().required(),
            supplierName: Joi.string().required(),
            supplierDiscount: Joi.number().default(0),
            gstNo: Joi.string().allow(""),
            panNo: Joi.string().required(),
            igst: Joi.boolean().default(false),
        }),
        selectStore: Joi.array().items({
            storeId: Joi.string().allow(""),
            storeName: Joi.string().allow(""),
        }),
        supplierAddress: Joi.object().keys({
            firstLine: Joi.string().required(),
            secondLine: Joi.string().allow(""),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().allow(""),
        }),
        bankDetails: Joi.array().items({
            bankName: Joi.string().allow(""),
            accountNumber: Joi.string().allow(""),

            IFSC: Joi.string().allow(""),
            bankBranch: Joi.string().allow(""),
            attachmentsUrl: Joi.string().allow(""),
        }),
        openingBalance: Joi.string().allow(""),
        defineMyOwnCode: Joi.string().allow(""),
        preferredSupplier: Joi.boolean().default(false),
        paymentTerms: Joi.string().allow(""),
        representativeDetials: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            contacts: Joi.array().items({
                contactType: Joi.string().allow(""),
                phoneNo: Joi.string().required(),
            }),
        },
        faxNo: Joi.string().allow(""),
        website: Joi.string().allow(""),
        email: Joi.string().required(),
        photoUrl: Joi.string().allow(""),
        referedBy: Joi.string().allow(""),
        percentageCommision: Joi.string().allow(""),
        status: Joi.boolean().default(false),
        visibility: Joi.boolean().default(false),
        ts_l: Joi.date().default(Date.now()),
    }).options({ abortEarly: false });

    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
}