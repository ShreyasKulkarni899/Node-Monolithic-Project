const mongoose = require("mongoose");
const inquirySchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    customerId: String,
    customerName: String,
    tokenNumber: String,
    product: [
      {
        productName: String,
        quantity: String,
        price: String,
        productId: String,
      },
    ],
    reason: String,
    barcode: String,
    day: String,
    isEnquired: Boolean,
    isPurchased: Boolean,
    isApproved: Boolean,
    approvedBy: String,
    billNo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("inquiry", inquirySchema);
