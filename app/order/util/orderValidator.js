const mongoose = require('mongoose');
const Joi = require("joi");
//Joi.objectId = require('joi-objectid')(Joi)
//const ObjectId = mongoose.Schema.Types.ObjectId;

function orderValidator() {
    const orderSchema = Joi.object({
        orderNo: Joi.number().default(0),
        // storeId: String,
        storeName: Joi.string().required(),
        storeId: Joi.string().allow(""), //.ref('stores'),
        // orderedById: String,
        orderedByName: Joi.string().allow(""),
        orderedById: Joi.string().allow(""), //.ref('employees'),
        // supplierId:String,
        supplierName: Joi.string().required(),
        supplierId: Joi.string().allow(""), //.ref('suppliers'),
        orderDate: Joi.date().required(),
        orderStatus: Joi.string().allow(""),
        estimatedDeliveryDate: Joi.date().required(),
        transportId: Joi.string().allow(""), //.ref('transports'),
        transportName: Joi.string().allow(""),
        attachmentUrl: Joi.string().allow(""),
        products: Joi.array().items({
            department: Joi.string().allow(""),
            productItem: Joi.string().allow(""),
            productType: Joi.string().allow(""),
            brand: Joi.string().allow(""),
            designNumber: Joi.string().allow(""),
            style: Joi.string().allow(""),
            pattern: Joi.string().allow(""),
            fitting: Joi.string().allow(""),
            fabric: Joi.string().allow(""),
            numberOfPieces: Joi.number().default(0),
            hsn: Joi.string().allow(""),
            gstPercent: Joi.number().default(0),
            sizeType: Joi.string().allow(""),
            varients: Joi.array().items({
                colour: Joi.string().allow(""),
                size: Joi.string().allow(""),
                description: Joi.string().allow(""),

                quantity: Joi.number().default(0),

                grossPurchasePrice: Joi.number().default(0),
                purchaseDiscount: Joi.number().default(0),
                netPurchasePrice: Joi.number().default(0),
                brandMrp: Joi.number().default(0),
                sellingUnit: Joi.string().allow(""),
                purchaseGstRate: Joi.number().default(0),
                saleGstRate: Joi.number().default(0),

                saleRate: Joi.number().default(0),
                secondaryQuantity: Joi.number().default(0),
                productImageUrl: Joi.array().items(Joi.string().allow("")),

                tertiaryQuantity: Joi.number().default(0),
                saleRateRoundup: Joi.string().allow("")

            }),
            totalPurchase: Joi.number().default(0),
            primaryUnit: Joi.string().allow(""),
            secondaryGroupUnit: Joi.string().allow(""),
            tertiaryGroupUnit: Joi.string().allow(""),
            noOfPrimaryUnitsPerSecondaryGroup: Joi.number().default(0),
            noOfPrimaryUnitsPerTertiaryGroup: Joi.number().default(0),
            productClassification: Joi.string().allow(""),
            productId: Joi.string().allow("")
        }),
        totalPrimaryQty: Joi.number().default(0),
        totalSecondaryQty: Joi.number().default(0),
        totalTertiaryQty: Joi.number().default(0),
        totalGrossPurchase: Joi.number().default(0),
        totalPurchaseDiscount: Joi.number().default(0),
        totalNetPurchase: Joi.number().default(0),
        otherCharges: Joi.number().default(0),

        purchaseGst: Joi.object().keys({
            totalCgst: Joi.number().default(0),
            totalSgst: Joi.number().default(0),
            totalIgst: Joi.number().default(0)
        }),

        totalAmount: Joi.number().default(0),
        orderDeleteStatus: Joi.boolean().default(false),
    });
    // var date1 = orderSchema.orderDate;
    // var date2 = orderSchema.estimatedDeliveryDate;
    // // const result;
    // if (date2.getTime() >= date1.getTime()) {
    //     //     const result = orderSchema.validate();
    //     console.log("1010")
    // } else {
    //     console.log("Not working re baba")
    // }
    const result = orderSchema.validate();
    return result.error ? result.error.details[0].message : false;
}

//const orderValidator = orderValidator();
module.exports = orderValidator;