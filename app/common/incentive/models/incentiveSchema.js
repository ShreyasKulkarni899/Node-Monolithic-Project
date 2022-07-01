const mongoose = require('mongoose');
const incentiveSchema = mongoose.Schema({

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'inventories' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },
    workType: String,
    // store
    // department 
    // section
    // counter
    // cashier
    // operator
    // labeler
    // sales
    // agent
    // sorter 
    purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'purchases' },
    incentiveAmount: Number,
    paidStatus: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });


module.exports = mongoose.model('employeeIncentive', incentiveSchema);