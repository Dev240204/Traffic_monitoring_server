const express = require('express');
const mongoose = require('mongoose');
const Roads = require('../models/roads');
const Locations = require('../models/locations');
const fastcsv = require("fast-csv");
const fs = require("fs");
const { findShortestPath } = require('../utils/shortest-path');

const roadRouter = express.Router();

// Route for getting traffic condition for a road
roadRouter.get("/:id/traffic-condition", async (req,res)=>{
    try{
        const road = await Roads.findById(req.params.id);
        if(!road){
            res.status(404).send("Road not found");
        }
        res.status(200).send(`Traffic condition for the road between ${road.start_location_name} and ${road.end_location_name} is ${road.traffic_condition}`);
    }catch(err){
        res.status(500).send(`Internal server error : ${err}`);
    }   
})

// Route for getting all roads traffic condition report
roadRouter.get("/report/traffic", async (req,res)=>{
    try {
        const roads = await Roads.find().lean(); // Use .lean() to get plain JavaScript objects
        
        if (roads.length === 0) {
            return res.status(404).send("No roads found");
        }

        // Transform the data to ensure it is in a flat format
        const transformedData = roads.map(road => ({
            start_location_id: road.start_location_id,
            start_location_name: road.start_location_name,
            end_location_id: road.end_location_id,
            end_location_name: road.end_location_name,
            distance: road.distance,
            traffic_condition: road.traffic_condition,
            time_stamp: road.time_stamp.toISOString() // Convert Date to ISO string
        }));

        // Create a writable stream to write the CSV file
        const ws = fs.createWriteStream('traffic-report.csv');

        fastcsv
            .write(transformedData, { headers: true })
            .on('finish', () => {
                console.log("Write to traffic-report.csv successfully!");
            })
            .pipe(ws);

        res.status(200).send("Traffic report generated successfully and stored in the server as traffic-report.csv");
    }
    catch(err){
        res.status(500).send(`Internal server error : ${err}`);
    }
})

// Route for adding a new road
roadRouter.post("/add", async (req,res)=>{
    try{
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
            start_location_name: data.location_A,
            end_location_id: location_B._id,
            end_location_name: data.location_B,
            distance: data.distance,
            traffic_condition: data.traffic_condition,
            time_stamp: new Date()
        })
    
        res.status(201).send("Successfully added road between " + data.location_A + " and " + data.location_B);
    }
    catch(err){
        res.status(500).send(`Internal server error : ${err}`);
    }
})

// Route for updating traffic condition for a road
roadRouter.patch("/traffic-updates", async (req,res)=>{
    try{
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
    }
    catch(err){
        res.status(500).send(`Internal server error : ${err}`);
    }
})

// Route for shortest path calculation between two locations using Dijkstra's algorithm but not fully implemented
roadRouter.get("/shortest-path", async (req, res) => {
    try {
        const data = req.body;
        const locationA = await Locations.findOne({ location_name: data.location_A });
        const locationB = await Locations.findOne({ location_name: data.location_B });
        const roads = await Roads.find();

        if (!locationA || !locationB) {
            return res.status(404).send("Location not found");
        }

        const graph = {};
        for (let road of roads) {
            if (!graph[road.start_location_name]) {
                graph[road.start_location_name] = {};
            }
            graph[road.start_location_name][road.end_location_name] = road.distance;
        }

        const path = findShortestPath(graph, locationA.location_name, locationB.location_name);
        res.status(200).send(path);
    } catch (err) {
        console.error("Error in shortest path calculation:", err);
        res.status(500).send(`Internal server error: ${err.message}`);
    }
});

module.exports = roadRouter;