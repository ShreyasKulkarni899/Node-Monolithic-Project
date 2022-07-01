const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const employeeSchema = new mongoose.Schema({
    // storeid: String,
    employeeid: String,
    personalDetails: {
        firstName: String,
        middleName: String,
        lastName: String,
        joiningDate: Date,
        dateOfBirth: Date,
        domicile: String,
        maritialStatus: String,
        StringOfDependents: String,
        anniversary: Date,
        profileimage: Object,
    },

    addresses: [{
        addressType: String,
        firstLine: String,
        secondLine: String,
        city: String,
        state: String,
        pincode: String,
    }, ],
    contacts: [{
        contactsType: String,
        phoneNo: String,
        contactPersonName: String,
        relation: String,
    }, ],
    education: [{
        educationType: String,
        qualification: String,
        specification: String,
        institute: String,
        yearOfPassing: String,
        certficateUrl: String,
    }, ],
    workExperience: [{
        companyName: String,
        position: String,
        yearsOfExperience: String,
        reference: String,
        referenceContact: String,
    }, ],
    identity: [{
        idType: String,
        cardNumber: String,
        idUrl: Object,
    }, ],
    referral: [{
        referralType: String,
        name: String,
        nameOther: String,
        id: String,
        contact: String,
        referralIdUrl: String,
        idUrl: Object,
    }, ],
    workDetails: {
        position: String,
        department: String,
        section: String,
        // shift: String,
        salary: String,
        salaryType: String,
        hiredBy: String,
    },
    apraisal: [{
        position: String,
        department: String,
        section: String,
        salary: String,
        salaryType: String,
        fromDate: Date,
        toDate: Date,
        rating: String,
        incrementType: String,
        incrementAmount: String,
    }, ],
    employeeReferralincentive: {
        amount: String,
        duration: String,
        employee1: String,
        employee2: String, //mismatch
    },
    loginDetails: {
        empUserName: String,
        email: String,
        phone: String,
        password: String,
    },
    moduleAccessList: [String],
    onduty: {
        type: Boolean,
        default: false,
    },
    customerReferralincentive: {
        amount: String,
        coins: String,
        customer1: String,
        customer2: String,
    },
    productIncentive: {
        amount: Number
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

employeeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("employee", employeeSchema);