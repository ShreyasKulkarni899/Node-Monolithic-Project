const mongoose = require('mongoose');
const { Double } = require('mongodb');
const counterSchema = mongoose.Schema({
    _id: String,
    counter: Number,
});

module.exports = mongoose.model('counters', counterSchema);