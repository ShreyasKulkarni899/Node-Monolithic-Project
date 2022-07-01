const mongoose = require('mongoose');
//const connectOrderDB = require("../../../db.js");
// const employeeSchema = require("./employeeSchema");
// const supplierSchema = require('../models/supplierSchema');


//Schema = mongoose.Schema;

// autoincreament
//const autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(connectOrderDB);


const orderSchema = new mongoose.Schema({
    orderNo: Number,
    // storeId: String,
    storeName: String,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'stores' },
    // orderedById: String,
    orderedByName: String,
    orderedById: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
    // supplierId:String,
    supplierName: String,
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers' },
    orderDate: Date,
    orderStatus: String,
    estimatedDeliveryDate: Date,
    transportId: { type: mongoose.Schema.Types.ObjectId, ref: 'transports' },
    transportName: String,
    attachmentUrl: String,
    products: [{
        department: String,
        productItem: String,
        productType: String,
        brand: String,
        designNumber: String,
        style: String,
        pattern: String,
        fitting: String,
        fabric: String,
        numberOfPieces: Number,
        hsn: String,
        gstPercent: Number,
        sizeType: String,
        varients: [{
            colour: String,
            size: String,
            description: String,

            quantity: Number,

            grossPurchasePrice: Number,
            purchaseDiscount: Number,
            netPurchasePrice: Number,
            brandMrp: Number,
            sellingUnit: String,
            purchaseGstRate: Number,
            saleGstRate: Number,

            saleRate: Number,
            secondaryQuantity: Number,
            productImageUrl: [String],

            tertiaryQuantity: Number,
            saleRateRoundup: String

        }],
        totalPurchase: Number,
        primaryUnit: String,
        secondaryGroupUnit: String,
        tertiaryGroupUnit: String,
        noOfPrimaryUnitsPerSecondaryGroup: Number,
        noOfPrimaryUnitsPerTertiaryGroup: Number,
        productClassification: String,
        productId: String
    }],
    totalPrimaryQty: Number,
    totalSecondaryQty: Number,
    totalTertiaryQty: Number,
    totalGrossPurchase: Number,
    totalPurchaseDiscount: Number,
    totalNetPurchase: Number,
    otherCharges: Number,

    purchaseGst: {
        totalCgst: Number,
        totalSgst: Number,
        totalIgst: Number
    },

    totalAmount: Number,
    orderDeleteStatus: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

// orderSchema.plugin(autoIncrement.plugin, {
//     model: "orders",
//     field: "orderNo"
// });
// orderSchema.method("toJSON", function() {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });
module.exports = mongoose.model('orders', orderSchema);