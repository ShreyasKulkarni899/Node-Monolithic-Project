const mongoose = require('mongoose');

const discountsMarginIncentiveSchema = mongoose.Schema({
    documentType: String,
    // discount
    // margin
    // incentive
    department: String,
    productItem: String,
    productType: String,
    brand: String,
    section: String,
    counter: String,
    season: String,
    purchaseRateMin: Number,
    purchaseRateMax: Number,
    saleRateMin: Number,
    saleRateMax: Number,
    marginType: String,
    // fixed
    // percent

    marginValue: Number,
    discountType: String,
    // regular
    // seasonal
    // special
    // quatity

    discountCalculatinType: String,
    // percet
    // fixed

    discount: Number,
    // positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees' },

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
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: true
    },
    discountStartDate: Date,
    discountEndDate: Date
},
    { timestamps: true });

module.exports = mongoose.model('discountsMarginIncentivePreset', discountsMarginIncentiveSchema);

