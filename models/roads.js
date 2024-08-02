const e = require('express');
const mongoose = require('mongoose');
const Locations = require('./locations');

const roadSchema = mongoose.Schema({
    start_location_id : {
        type: String,
        required: true
    },
    end_location_id : {
        type: String,
        required: true,
    },
    distance:{
        type: Number,
        required: true
    },
    traffic_condition:{
        type: String,
        required: true
    },
    time_stamp :{
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Roads', roadSchema);