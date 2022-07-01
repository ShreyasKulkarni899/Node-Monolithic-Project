const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.allocation = require("../../allocation/models/allocationSchema.js")(mongoose);
db.supplier = require("../../supplier/models/supplierSchema.js")(mongoose);
db.employee = require("../../employee/models/employeeSchema.js")(mongoose);
db.customer = require("../../customer/models/customerSchema.js")(mongoose);
db.store = require("../../store/models/storeSchema.js")(mongoose);
db.transport = require("../../transport/models/transportSchema.js")(mongoose);
db.order = require("../../order/models/orderSchema.js")(mongoose);
db.dropdownList = require("../../generalDropDownList/models/dropdownListSchema.js")(mongoose);
db.purchase = require("../../purchase/models/purchaseSchema.js");
db.inventory = require("../../inventory/models/inventorySchema.js")(mongoose);
//db.purchaseReturn = require("../../purchaseReturn/models/purchaseReturnSchema.js")(mongoose);

module.exports = db;