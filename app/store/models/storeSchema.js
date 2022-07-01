const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const schema = mongoose.Schema;

const storeSchema = new schema({
    logoUrl: String,
    storeName: String,
    proprietorName: String,
    gstNo: String,
    emailAddress: String,
    contact: String,
    address: {
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
    taxMethod: String,
    storeCustomField1: String,
    storeCustomField2: String,
    barcodePrefix: String,
    additionalDescription: String,
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

storeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('stores', storeSchema);
