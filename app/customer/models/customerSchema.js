const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const customerSchema = new mongoose.Schema({
    customerId: String,
    personalDetails: {
        firstName: String,
        middleName: String,
        lastName: String,
        dateOfBirth: Date,
        anniversary: Date,
        profession: String,
        maritialStatus: String,
        joiningDate: Date,
        profileImageUrl: String,
    },
    addresses: [{
        addressType: String,
        firstLine: String,
        secondLine: String,
        city: String,
        pincode: String
    }],
    shippingAddress: [{
        addressType: String,
        firstLine: String,
        secondLine: String,
        city: String,
        pincode: String
    }],

    contacts: [{
        contactType: String,
        phoneNo: String,
        contactPersonName: String,
        relation: String
    }],
    loginDetails: {
        custUserName: String,
        email: String,
        phone: String,
        password: String
    },

    identityDocuments: [{
        idType: String,
        cardNumber: String,
        idUrl: String
    }],
    customerGroup: Boolean,
    activeStatus: Boolean,
    asAgentActiveStatus: Boolean,
    bankDetail: [{
        bankName: String,
        accountNumber: String,
        ifsc: String,
        branch: String,
        narration: String,
    }],
    customerCredit: {
        applicableStatus: {
            type: Boolean,
            default: false
        },
        creditLimit: Number,
        openingBalance: Number,
        creditDueDays: Number,
        referredByCustomer: {
            customerId: String,
            name: String,
        },
        referredByEmployee: {
            employeeId: String,
            name: String,
        },
        discountApplicable: String,
        spotBillDiscount: {
            type: Boolean,
            default: false
        },
        discountOnReceipt: {
            type: Boolean,
            default: false
        },
    },
    customerLoyaltyProgram: {
        loyaltyCardActiveStatus: Boolean,
        loyaltyCardNumber: String,
        enrollmentDate: Date,
        loyaltyCardPoints: Number,
        referredByCustomer: {
            customerId: String,
            name: String,
        },
        referredByEmployee: {
            employeeId: String,
            name: String,
        },
        extraDiscount: String,
        cashBackDiscount: Boolean,
        spotDiscount: Boolean,
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

// customerSchema.method("toJSON", function() {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });


customerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('customer', customerSchema);