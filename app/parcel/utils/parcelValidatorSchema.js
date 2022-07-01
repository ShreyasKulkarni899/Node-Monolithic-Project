const Joi = require('joi');

module.exports = (data) => {
    const JoiSchema = Joi.object({
        parcelEntryType: Joi.string().required(),
        parcelNumber: Joi.number().default(0),

        storeId: Joi.string().required(),
        storeName: Joi.string().required(),

        parcelReceivedBy: Joi.string().allow(""),
        parcelReceivedByName: Joi.string().allow(""),

        supplierId: Joi.string().allow(""),
        supplierName: Joi.string().allow(""),
        parcelReceivedDate: Joi.date().required(),

        transportId: Joi.string().required(),
        transportName: Joi.string().required(),

        lrNumber: Joi.string().required(),
        numberOfBales: Joi.number().required(),

        orderId: Joi.array().items(Joi.string().allow("")),
        orderNumber: Joi.array().items(Joi.number()).required(),
        purchaseReturnId: Joi.array().items(Joi.string().allow("")),
        purchaseReturnNumber: Joi.array().items(Joi.number()).allow(""),

        supplierInvoiceNumber: Joi.string().allow(""),
        vehicleNumeber: Joi.string().allow(""),
        hamal: Joi.string().allow(""),
        fright: Joi.number().required(),
        parcelBookingDate: Joi.date().required(),
        parcelType: Joi.string().allow(""),
        deliveryLocation: Joi.string().required(),
        description: Joi.string().allow(""),

        operatorId: Joi.string().allow(""),
        operatorName: Joi.string().allow(""),

        date: Joi.date(),
        //default : Recieved, Other : Opened, Future : Partial, Damaged 
        parcelStatus: Joi.string().allow("")
    }).options({ abortEarly: false });

    var result = JoiSchema.validate(data);
    return result.error ? result.error.details[0].message : false;
}