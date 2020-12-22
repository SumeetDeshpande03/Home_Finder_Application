"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const OpenHouseDetails = require('../models/openHouseDetails');
const SellListing = require('../models/sellListing');


router.post("/", async (req,res) => {

    // Test - Start
    var currentDate = new Date()
    console.log(currentDate)
    await SellListing.findOne({_id: req.body.listing, openhouseStartDate: {'$lte': currentDate}, openhouseEndDate: {'$gte': currentDate}}, async (err, listingDetails) => {
        if(err){
            console.log("Invalid Listing ID")
            return null;
        } else if(listingDetails){
            res.status(500).send("Openhouse is already scheduled for this property");
        } else {
            await SellListing.update({_id: req.body.listing}, {$set:{"openhouseStartDate": req.body.startDate, "openhouseEndDate": req.body.endDate}}, function(err, result) {
                if(err){
                    res.status(500).send("Error scheduling openhouse");
                } else {
                    res.status(200).send(result);
                }
            });
        }
    });
})

module.exports = router;
