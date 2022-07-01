const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
    //import mongoosePaginate from 'mongoose-paginate-v2'

const transportSchema = mongoose.Schema({
    transportCode: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: false },
    ownersContactNo: { type: String, required: true },
    email: { type: String, required: false },
    transportName: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: false },
    gst: { type: String, required: false },
    panNo: { type: String, required: false },

    igst: { type: Boolean, required: false },

    contactDetails: [{
        operatorsName: { type: String, required: true },
        operatorMobile: { type: String, required: true },
        faxNo: { type: String, required: false }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

// transportSchema.method("toJSON", function() {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });
transportSchema.plugin(mongoosePaginate);
const transport = mongoose.model('transports', transportSchema);


module.exports = transport;