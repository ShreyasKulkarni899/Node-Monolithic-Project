const mongoose = require("mongoose");

const loggerSchema = new mongoose.Schema(
  {
    userId: String,
    status: String,
    method: String,
    endpoint: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logger", loggerSchema);
