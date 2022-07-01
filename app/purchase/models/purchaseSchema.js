const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// autoincreament
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.connection);


const purchaseSchema = mongoose.Schema({
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    storeName: String,
    purchaseBillDate: Date,
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
    supplierName: String,
    // orderDetails: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
    orderDetails: [{
        orderNumber: String,
        status: String
            //partial Received
            //fullyReceived
    }],
    supplierBillDate: Date,
    supplierBillNumber: String,
    lrNumber: [String],
    purchaseBillNumber: String,
    attachDocURL: String,
    sortedById: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
    sortedByName: String,
    labeledBy: [{
        userId: String,
        userName: String
    }],
    totalPrimaryQty: Number,
    totalSecondaryQty: Number,
    totalTertiaryQty: Number,
    totalGrossPurchase: Number,
    totalNetPurchase: Number,
    totalProducts: Number,
    purchaseGst: {
        totalIgst: Number,
        totalSgst: Number,
        totalCgst: Number
    },
    otherCharges: Number,
    totalAmount: Number,

    purchaseDeleteStatus: {
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


// purchaseSchema.plugin(autoIncrement.plugin, {
//     model: "purchases",
//     field: "purchaseNumber"
// });

//const transport = mongoose.model('purchase', purchaseSchema);
purchaseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('purchases', purchaseSchema);