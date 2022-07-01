const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logUserSchema = new Schema(
  {
    userType: { type: String, required: true },
    userName: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("logUser", logUserSchema);
