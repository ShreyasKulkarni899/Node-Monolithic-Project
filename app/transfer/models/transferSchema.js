const { Transaction } = require('mongodb');
const mongoose = require('mongoose');


const transferSchema = new mongoose.Schema({
    transferedProductList: [{
        productId: String,
        barcode: String,
        sentQuantity: Number,
        receivedQuantity: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false }
    }],
    receivedProductList: [{
        receivedProd: [{
            productId: String,
            barcode: String,
            receivedQuantity: Number,
            isDeleted: { type: Boolean, default: false }
        }],
        receiverOperatorId: String,
        receiverNarratorId: String,
        receivedDateTime: Date
    }],
    transferSerialNumber: Number,
    transferOperatorId: String,
    transferNarratorId: String,
    fromLocation: String,
    toLocation: String,
    voucherType: String,
    voucherNumber: String,
    transferDateTime: Date,
    isTransferCompleted: { type: Boolean, default: false }
}, { timestamp: true });

module.exports = mongoose.model('transferDetails', transferSchema);