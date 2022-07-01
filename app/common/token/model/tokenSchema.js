const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    customerId: String,
    customerName: String,
    tokenNumber: String,
    product: [
      {
        productId: String,
        productName: String,
        quantity: String,
      },
    ],
    barcode: String,
    day: String,
    isEnquired: Boolean,
    isPurchased: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("tokens", tokenSchema);
