const mongoose = require('mongoose');
const Joi = require('joi');
const orderValidator = require('../../order/util/orderValidator');

function inventory() {
    const inventorySchema = Joi.object({
        numberOfPieces: Joi.number(),
        purchaseId: Joi.string(),
        purchaseBillDate: Joi.date(),
        purchaseBillNumber: Joi.string(),
        barcode: Joi.string(),
        orderID: Joi.string(),
        orderDate: Joi.date(),
        storeId: Joi.string(),
        storeName: Joi.string(),
        orderedById: Joi.string(),
        orderedByName: Joi.string(),
        supplierId: Joi.string(),
        //supplierName: Joi.string(),
        supplierCode: Joi.string(),
        transportId: Joi.string(),
        transportName: Joi.string(),
        attachmentUrl: Joi.string(),
        department: Joi.string(),
        productItem: Joi.string(),
        productType: Joi.string(),
        brand: Joi.string(),
        designNumber: Joi.string(),
        style: Joi.string(),
        pattern: Joi.string(),
        fitting: Joi.string(),
        fabric: Joi.string(),
        hsn: Joi.string(),
        gstPercent: Joi.number(),
        productClassification: Joi.string(),
        secondaryGroupUnit: Joi.string(),
        tertiaryGroupUnit: Joi.string(),
        noOfPrimaryUnitsPerSecondaryGroup: Joi.number(),
        noOfPrimaryUnitsPerTertiaryGroup: Joi.number(),
        primaryUnit: Joi.string(),
        sizeType: Joi.string(),
        productImageUrl: Joi.array().items(Joi.string()),
        colour: Joi.string(),
        size: Joi.string(),
        description: Joi.string(),
        quantity: Joi.number(),
        grossPurchasePrice: Joi.number(),
        purchaseDiscount: Joi.number(),
        netPurchasePrice: Joi.number(),
        brandMrp: Joi.number(),
        sellingUnit: Joi.string(),
        purchaseGstRate: Joi.number(),
        saleGstRate: Joi.number(),
        saleRate: Joi.number(),
        secondaryQuantity: Joi.number(),
        tertiaryQuantity: Joi.number(),
        saleRateRoundup: Joi.boolean(),
        purchaseBillIndex: Joi.string(),
        purchaseQuantity: Joi.number(),
        stock: Joi.number(),

        // purchasePrice: Number,
        // usernameProductCreator: String,
        stockLocation: Joi.object().keys({
            store: Joi.object().keys(Joi.number()),
            transientState: Joi.object().keys(Joi.number()),
            warehouse: Joi.object().keys(Joi.number())
        }),
        storeSection: Joi.string(),
        //
        counter: Joi.string(),
        warehouseSection: Joi.string(),
        rackNo: Joi.string(),

        status: Joi.object().keys(Joi.boolean()),

        discounts: Joi.array().items({
            discountType: Joi.string(),
            // regular - priority 4
            // quatity - priority 3
            // seasonal - priority 2
            // special - priority 1
            status: Joi.boolean(),
            discountCalculatinType: Joi.string(),
            // percet
            // fixed    
            discount: Joi.number(),
            // positionId: Joi.string(),

            discountStartDate: Joi.date(),
            discountEndDate: Joi.date()
        }),

        incentives: Joi.array().items({
            workType: Joi.string(),
            // store
            // department 
            // section
            // counter
            // cashier
            // operator
            // store
            // labeler
            // sales
            // agent
            specification: Joi.string(),
            //{department: men}
            // women
            // cashier1
            // cashier2
            // counter1
            // counter2
            // sales

            incentiveCalculationType: Joi.string(),
            // percet
            // fixed
            incentive: Joi.number()

        })
    });
    const result = inventorySchema.validate();
    return result.error ? result.error.details[0].message : false;
}

//exporting
module.exports = orderValidator;