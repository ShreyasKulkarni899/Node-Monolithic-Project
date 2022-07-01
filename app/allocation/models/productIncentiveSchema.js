const mongoose = require('mongoose');
const productIncentiveSchema = mongoose.Schema({

    documentType: String,
    department: String,
    productItem: String,
    productType: String,
    brand: String,
    sectionSection: String,
    counterIncentive: String,
    extraDiscAllowed: String,
    cashierIncentive: String,
    operatorIncentive: String,
    sorterIncentive: String,
    labelerIncentive: String,

    incentiveType: String,
    // regular
    // seasoal

    incentiveCalculationType: String,
    // percet
    // fixed
    // default

    incentive: Number,

    status: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });


module.exports = mongoose.model('productIncentive', productIncentiveSchema);