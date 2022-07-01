const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
  {
    numberOfPieces: Number,
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "purchases" },
    purchaseBillDate: Date,
    purchaseBillNumber: String,
    barcode: String,
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: "orders" },
    orderDate: Date,
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "stores" },
    storeName: String,
    orderedById: { type: mongoose.Schema.Types.ObjectId, ref: "employees" },
    orderedByName: String,
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
    //supplierName: String,
    supplierCode: String,
    transportId: { type: mongoose.Schema.Types.ObjectId, ref: "transports" },
    transportName: String,
    attachmentUrl: String,
    department: String,
    productItem: String,
    productType: String,
    brand: String,
    designNumber: String,
    style: String,
    pattern: String,
    fitting: String,
    fabric: String,
    hsn: String,
    gstPercent: Number,
    productClassification: String,
    secondaryGroupUnit: String,
    tertiaryGroupUnit: String,
    noOfPrimaryUnitsPerSecondaryGroup: Number,
    noOfPrimaryUnitsPerTertiaryGroup: Number,
    primaryUnit: String,
    sizeType: String,
    productImageUrl: [String],
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
    tertiaryQuantity: Number,
    saleRateRoundup: Boolean,
    purchaseBillIndex: String,
    purchaseQuantity: Number,
    stock: Number,

    // purchasePrice: Number,
    // usernameProductCreator: String,
    stockLocation: {
      store: { type: Number, default: 0 },
      transientState: { type: Number, default: 0 },
      warehouse: { type: Number, default: 0 },
    },
    storeSection: String,
    //
    counter: String,
    warehouseSection: String,
    rackNo: String,

    status: {
      type: Boolean,
      default: true,
    },

    discounts: [
      {
        discountType: String,
        // regular - priority 4
        // quatity - priority 3
        // seasonal - priority 2
        // special - priority 1
        status: {
          type: Boolean,
          default: true,
        },
        discountCalculatinType: String,
        // percet
        // fixed
        discount: Number,
        // positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },

        discountStartDate: Date,
        discountEndDate: Date,
      },
    ],

    inc: Number,

    incentives: [
      {
        workType: String,
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
        specification: String,
        //{department: men}
        // women
        // cashier1
        // cashier2
        // counter1
        // counter2
        // sales

        incentiveCalculationType: String,
        // percet
        // fixed
        incentive: Number,
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inventory", inventorySchema);
