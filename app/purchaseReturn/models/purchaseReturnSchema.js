const mongoose = require("mongoose");
//const { Double } = require("mongodb");
// var autoIncrement = require("mongoose-auto-increment");
// autoIncrement.initialize(mongoose.connection);
const purchaseReturnSchema = mongoose.Schema({
    purchaseReturnNumber: Number, //auto generate
    purchaseDetails: [{
        purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "purchase" },
        purchaseBillNumber: String,
        purchaseBillDate: Date,
        supplierBillDate: Date,
        supplierBillNumber: String
    }],
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    storeName: String,
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
    supplierName: String,
    returnDate: Date,
    packedBy: { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    lrNumber: [String],
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    productsList: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "inventory" },
        quantity: Number,
        isDeleted: { type: Boolean, default: false },
    }, ],
}, { timestamps: true });

// purchaseReturnSchema.plugin(autoIncrement.plugin, {
//   model: "purchaseReturn",
//   field: "purchaseReturnNumber",
// });

module.exports = mongoose.model("purchaseReturn", purchaseReturnSchema);