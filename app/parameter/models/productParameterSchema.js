const mongoose = require("mongoose");

const productParameterSchema = new mongoose.Schema(
  {
    docType: String,
    department: String,
    productItem: String,
    productType: String,
    brand: String,
    designNumber: String,
    style: String,
    pattern: String,
    fitting: String,
    fabric: String,
    supplier: String,
    //hsn: String,
    hsnWithGst: {
      hsn: String,
      gstPercent: String,
    },
    //gstPercent: String,
    status: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    marginType: String,
    marginValue: Number,
    colour: String,
    sizeType: String,
    //size:String,
    sizeDetails: {
      size: String,
      sizeDescription: String,
    },
    // secondarySizeName:String,
    primaryUnit: String,
    secondaryGroupUnit: String,
    tertiaryGroupUnit: String,
    username: String,
    productMargin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("productParameters", productParameterSchema);
