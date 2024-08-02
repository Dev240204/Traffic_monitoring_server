const express = require('express');
const mongoose = require('mongoose');
const Roads = require('../models/roads');
const Locations = require('../models/locations');

const roadRouter = express.Router();

roadRouter.post("/add", async (req,res)=>{
    const data = req.body;
    const location_A = await Locations.findOne({location_name: data.location_A});
    const location_B = await Locations.findOne({location_name: data.location_B});
    const road = await Roads.findOne({
        start_location_id: location_A._id,
        end_location_id: location_B._id
    })
    if(road){
        if(road.distance == data.distance ){
            res.status(400).send("Road between " + data.location_A + " and " + data.location_B + " already exists with same distance");
        }
    }
    const newroad = await Roads.create({
        start_location_id: location_A._id,
        end_location_id: location_B._id,
        distance: data.distance,
        traffic_condition: data.traffic_condition,
        time_stamp: new Date()
    })

    res.status(201).send("Successfully added road between " + data.location_A + " and " + data.location_B);
})

roadRouter.patch("/traffic-updates", async (req,res)=>{
    const data = req.body;
    const location_A = await Locations.findOne({location_name: data.location_A});
    const location_B = await Locations.findOne({location_name: data.location_B});
    const road = await Roads.findOne({
        start_location_id: location_A._id,
        end_location_id: location_B._id,
        distance: data.distance
    })
    if(!road){
        res.status(400).send("Road between " + data.location_A + " and " + data.location_B + " does not exist for the given distance");
    }
    const updatedRoad = await Roads.findOneAndUpdate({
        start_location_id: location_A._id,
        end_location_id: location_B._id,
        distance: data.distance
    },{
        traffic_condition: data.traffic_condition,
        time_stamp: new Date()
    })
    res.status(200).send("Successfully updated traffic condition for road between " + data.location_A + " and " + data.location_B + " with distance " + data.distance);
})

module.exports = roadRouter;