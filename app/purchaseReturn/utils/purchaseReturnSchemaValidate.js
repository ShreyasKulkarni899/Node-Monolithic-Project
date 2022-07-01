const Joi = require("joi");

module.exports = (data) => {
    const JoiSchema = Joi.object({
        purchaseReturnNumber: Joi.number(),
        purchaseDetails: Joi.array().items({
            purchaseId: Joi.string(),
            purchaseBillNumber: Joi.string(),
            purchaseBillDate: Joi.date(),
            supplierBillDate: Joi.date(),
            supplierBillNumber: Joi.string(),
        }),
        storeId: Joi.string(),
        storeName: Joi.string(),

        supplierId: Joi.string().allow(""),
        supplierName: Joi.string().allow(""),
        returnDate: Joi.date().default(Date.now()),
        packedBy: Joi.string().allow(""),
        lrNumber: Joi.array().items(Joi.string().allow("")),
        productsList: Joi.array().items({
            productId: Joi.string().allow(""),
            quantity: Joi.number().default(0),
            isDeleted: Joi.boolean().default(false),
        }),
    });

    const result = JoiSchema.validate(data);
    console.log(result.error);
    return result.error ? result.error.details[0].message : false;
};