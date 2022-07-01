
const mongoose = require('mongoose')

const generalDropDownListSchema = new mongoose.Schema({
    title: String,
    dropdownList: [String],
    status: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('generalDropDownList', generalDropDownListSchema)