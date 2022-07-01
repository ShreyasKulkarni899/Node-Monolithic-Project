const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userType: String, // Employee, Customer
    userName: String,
    userEmail: String,
    userPassword: String,
    userRole: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSchema", userSchema);
