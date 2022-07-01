const mongoose = require("mongoose");

const ImagesSchema = new mongoose.Schema(
  {
    createdBy: String,
    moduleType: String,
    type: String,
    fileName: String,
    filePath: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImagesSchema", ImagesSchema);
