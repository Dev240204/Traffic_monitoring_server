const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    location_name:{
        type: String,
        required: true
    },
    latitude:{
        type: Number,
        required: true
    },
    longitude:{
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Locations', locationSchema);