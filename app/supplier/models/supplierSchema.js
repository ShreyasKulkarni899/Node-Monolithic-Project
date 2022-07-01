const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema;

const supplierSchema = new schema({
    supplierDetails: {
        supplierCode: String,
        supplierName: String,
        supplierDiscount: Number,
        gstNo: String,
        panNo: String,
        igst: Boolean,
    },
    selectStore: [{
        storeId: String,
        storeName: String,
    }],
    supplierAddress: {
        firstLine: String,
        secondLine: String,
        city: String,
        postalCode: {
            type: String,
            max: 6
        },
        state: String,
        country: String,
    },
    bankDetails: [{
        bankName: String,
        accountNumber: String,

        IFSC: String,
        bankBranch: String,
        attachmentsUrl: String,
    }],
    openingBalance: String,
    defineMyOwnCode: String,
    preferredSupplier: Boolean,
    paymentTerms: String,
    representativeDetials: {
        firstName: String,
        lastName: String,
        contacts: [
            {
                contactType: String,
                phoneNo: String,
            }],
    },
    faxNo: String,
    website: String,
    email: String,
    photoUrl: String,
    referedBy: String,
    percentageCommision: String,
    status: {
        type: Boolean,
        default: true
    },
    visibility: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: true
    },
    ts_l: Date

}, { timestamps: true });

// supplierSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });

supplierSchema.plugin(mongoosePaginate);
const Suppliers = mongoose.model('suppliers', supplierSchema);

module.exports = Suppliers;