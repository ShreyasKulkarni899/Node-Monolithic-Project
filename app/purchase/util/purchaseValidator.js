const mongoose = require("mongoose");
const Joi = require("joi");


function purchaseValidator() {
    const purchaseSchema = Joi.object({
        storeId: Joi.string().allow(""),
        storeName: Joi.string().allow(""),
        purchaseBillDate: Joi.date().default(Date.now()),
        supplierId: Joi.string().allow(""),
        supplierName: Joi.string().allow(""),
        // orderDetails: Joi.string(),
        orderDetails: Joi.array().items({
            orderNumber: Joi.string().allow(""),
            status: Joi.string().allow("")
                //partial Received
                //fullyReceived
        }),
        supplierBillDate: Joi.date().default(Date.now()),
        supplierBillNumber: Joi.string().allow(""),
        lrNumber: Joi.array().items(Joi.string().allow("")),
        purchaseBillNumber: Joi.string().allow(""),
        attachDocURL: Joi.string().allow(""),
        sortedById: Joi.string().allow(""),
        sortedByName: Joi.string().allow(""),
        labeledBy: Joi.array().items({
            userId: Joi.string().allow(""),
            userName: Joi.string().allow("")
        }),
        totalProducts: Joi.number().default(0),
        totalPrimaryQty: Joi.number().default(0),
        totalSecondaryQty: Joi.number().default(0),
        totalTertiaryQty: Joi.number().default(0),
        totalGrossPurchase: Joi.number().default(0),
        totalNetPurchase: Joi.number().default(0),
        purchaseGst: Joi.object().keys({
            totalIgst: Joi.number().default(0),
            totalSgst: Joi.number().default(0),
            totalCgst: Joi.number().default(0)
        }),
        otherCharges: Joi.number().default(0),
        totalAmount: Joi.number().default(0),

        purchaseDeleteStatus: Joi.boolean().default(false),


    });
    const result = purchaseSchema.validate();
    return result.error ? result.error.details[0].message : false;

}

//exporting
module.exports = purchaseValidator;