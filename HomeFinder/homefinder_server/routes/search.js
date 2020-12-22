"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const RentListing = require('../models/rentListing');
const SellListing = require('../models/sellListing');

router.post("/", async (req, res) => {
    try{
        var validQueries = ['zipcode','streetName','price','bedroom','bathroom','flooring',
        'homeType','parking','yearEstablished','amenities','area'];
        var queryData = {};
        var searchType = req.body['searchType']
        var payload = "";
        var rentResult = [];
        var sellResult = [];
        let finalResult = [];
        console.log(searchType)
        for(var k in req.body){
            if(validQueries.indexOf(k) > -1){
                if(req.body[k].length > 0){ //Check if an empty value was passed
                    if(req.body[k].indexOf('-') > -1){
                        console.log(k)
                        queryData[k] = { $gte: req.body[k].split('-')[0], $lte: req.body[k].split('-')[1] }
                    } else {
                        queryData[k] = req.body[k];
                    }
                    if(k == "amenities"){
                        queryData[k] = {$regex: req.body[k]}
                    }
                    if(searchType == "buy" && k == "price"){
                        delete queryData["price"]
                        queryData["sellingPrice"] = { $gte: req.body[k].split('-')[0], $lte: req.body[k].split('-')[1] }
                    }
                }
            }
        }
        queryData["user"] = {$ne: req.body["user_id"]}
        console.log(queryData);
        //var test = await RentListing.find(queryData).populate('user');
        //console.log(test)
        //{amenities: {$regex: "cuzzi"}}
        if(searchType === "rent"){
        finalResult = await RentListing.find(queryData).populate('user',(err,listings) => {
            if(err){
                console.log("Error : " + err);
                return [];
            } else {
                return listings;
            }
        });
        payload = JSON.stringify(finalResult);
        res.status(200).send(payload);
        }

        if(searchType === "buy"){
        finalResult = await SellListing.find(queryData).populate('user',(err,listings) => {
            if(err){
                console.log("Error : " + err);
                return [];
            } else {
                return listings;
            }
        });
        payload = JSON.stringify(finalResult);
        res.status(200).send(payload);
        }

    } catch(error){
        console.log(error);
        res.status(500).send("System Error");
    }
})

module.exports = router;