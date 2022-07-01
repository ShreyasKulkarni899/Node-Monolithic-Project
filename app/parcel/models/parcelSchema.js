const mongoose = require('mongoose');

// autoincreament
// var autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(mongoose.connection);

const parcelSchema = new mongoose.Schema({
    parcelEntryType: String,
    parcelNumber: String,


    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    storeName: String,

    parcelReceivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    parcelReceivedByName: String,
    parcelReceivedDate: Date,

    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
    supplierName: String,

    transportId: { type: mongoose.Schema.Types.ObjectId, ref: "transports" },
    transportName: String,

    lrNumber: String,
    numberOfBales: Number,

    orderId: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
    orderNumber: [Number],
    purchaseReturnId: [{ type: mongoose.Schema.Types.ObjectId, ref: "purchaseReturns" }],
    purchaseReturnNumber: [Number],

    supplierInvoiceNumber: String,
    vehicleNumeber: String,
    hamal: String,
    fright: Number,
    parcelBookingDate: Date,
    parcelType: String,
    deliveryLocation: String,
    description: String,

    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    operatorName: String,

    date: Date,
    //default : Recieved, Other : Opened, Future : Partial, Damaged 
    parcelStatus: {
        type: String,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// parcelSchema.plugin(autoIncrement.plugin, {
//     model: "parcels",
//     field: "parcelNumber"
// })
module.exports = mongoose.model('parcels', parcelSchema);