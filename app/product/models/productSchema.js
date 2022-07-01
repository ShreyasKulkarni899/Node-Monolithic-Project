const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    // supplierID:String,
    // supplierCode:String,
    productId: String,
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
    purchasePrice: String,
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
        saleRateRoundup: String,
    }, ],
    totalPurchase: Number,
    primaryUnit: String,
    secondaryGroupUnit: String,
    tertiaryGroupUnit: String,
    noOfPrimaryUnitsPerSecondaryGroup: Number,
    noOfPrimaryUnitsPerTertiaryGroup: Number,
    productClassification: String,
    usernameProductCreator: String,
    storeSection: String,
    warehouseSection: String,
    counter: String,
    rackNo: String,
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("product", productSchema);