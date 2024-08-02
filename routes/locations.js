const express = require('express');
const Locations = require('../models/locations');

const locationRouter = express.Router();

// Route for adding location details
locationRouter.post("/add", async (req,res)=>{
    try{
        const data = req.body
        console.log(data)
        const response = await Locations.findOne({location_name:data.location_name})
        if(response){
            res.send('Location already exists')
        }
        const location = await Locations.create({
            location_name: data.location_name,
            latitude: Number(data.latitude),
            longitude: Number(data.longitude)
        })
        res.status(201).send("Successfully added location")
    }catch(err){
        res.status(500).send(`Internal server error : ${err}`);
    }
})

module.exports = locationRouter;