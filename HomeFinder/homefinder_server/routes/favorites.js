"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const RentListing = require('../models/rentListing');
const SellListing = require('../models/sellListing'); 

router.get("/getUserDetails", async (req, res) => {
    try{
        const u = await Users.findById(req.query.id);
        //console.log(req.query)
        res.status(200).send(u)
    } catch(error){
        res.status(500).send("System Error");
    }
});

router.post("/addFav/", async (req,res) => {
    
    console.log("Reached Save as favorites");
    console.log(req.body)

    try{
        const user_id = req.body.user_id;
        const searchType = req.body.searchType
        const listing_id = req.body.listing_id
        const user = await Users.findById(user_id)
        if(!user){
            res.status(404).send("User Not found")
        } else{
            if(searchType === "rent"){
                const rentListing = await RentListing.findById(listing_id)
                if(!rentListing){
                    res.status(404).send("Rent Listing Not found")
                } else{
                    user.favoriteRentListings.push(rentListing)
                    await user.save((err,data) => {
                        if(err){
                            res.status(500).end("Unable to add to rent favorites");
                        } else{
                            console.log("Added to favorite rent listings")
                            res.status(200).send(data);
                        }
                    });
                }
            }else if(searchType === "buy"){
                const sellListing = await SellListing.findById(listing_id)
                if(!sellListing){
                    res.status(404).send("Sell Listing Not found")
                } else{
                    user.favoriteSellListings.push(sellListing)
                    await user.save((err,data) => {
                        if(err){
                            res.status(500).send("Unable to add to sell favorites");
                        } else{
                            console.log("Added to favorite sell listings")
                            res.status(200).send(data);
                        }
                    });
                }
            }
        }
    } catch(error){
        console.log(error);
        res.status(500).send("System Error");
    }
    
})

router.post("/removeFav/", async (req,res) => {
    
    //console.log(req.body)
    try{
        const user_id = req.body.user_id;
        const searchType = req.body.searchType
        const listing_id = req.body.listing_id
        const user = await Users.findById(user_id)
        if(!user){
            res.status(404).send("User Not found")
        } else{
            if(searchType === "rent"){
                console.log("This is a rent listing")
                var currFavorites = user["favoriteRentListings"].map(x=>x._id)
                console.log("Current : ",currFavorites.includes(req.body["listing_id"]))
                if(currFavorites.includes(req.body["listing_id"])){
                    for(var listing in user["favoriteRentListings"]) {
                        if(user["favoriteRentListings"][listing]["_id"] == req.body["listing_id"]){
                            var l = user.favoriteRentListings;
                            l.remove(user["favoriteRentListings"][listing]);
                            //user["favoriteRentListings"].remove(user["favoriteRentListings"][listing]["_id"])
                            /*await user.save((err,data) => {
                                if(err){
                                    res.status(500).end("Unable to add to rent favorites");
                                } else{
                                    console.log("Added to favorite rent listings")
                                    res.status(200).send(data);
                                }
                            });*/
                            console.log(l.length)
                            await Users.update({_id:req.body.user_id}, {$set:{favoriteRentListings: l}}, function(err, result) {
                                if (err){
                                    res.status(404).send("Unable to delete listing from Favorites list")
                                    console.log(err)
                                } else {
                                    console.log("success!")
                                    res.status(200).send(result);
                                }
                            });
                        }
                    }
                } else {
                    res.status(404).send("Not a favorite rent listing")
                }
            }
            if(searchType === "buy"){
                console.log("This is a sell listing")
                var currFavorites = user["favoriteSellListings"].map(x=>x._id)
                console.log("Current : ",currFavorites.includes(req.body["listing_id"]))
                if(currFavorites.includes(req.body["listing_id"])){
                    for(var listing in user["favoriteSellListings"]) {
                        if(user["favoriteSellListings"][listing]["_id"] == req.body["listing_id"]){
                            var l = user.favoriteSellListings;
                            l.remove(user["favoriteSellListings"][listing]);
                            //user["favoriteSellListings"].remove(user["favoriteSellListings"][listing]["_id"])
                            /*await user.save((err,data) => {
                                if(err){
                                    res.status(500).end("Unable to add to rent favorites");
                                } else{
                                    console.log("Removed from favorite rent listings")
                                    res.status(200).send(data);
                                }
                            });*/
                            console.log(l.length)
                            await Users.update({_id:req.body.user_id}, {$set:{favoriteSellListings: l}}, function(err, result) {
                                if (err){
                                    res.status(404).send("Unable to delete listing from Favorites list")
                                    console.log(err)
                                } else {
                                    console.log("success!")
                                    res.status(200).send(result);
                                }
                            });
                        }
                    }
                } else {
                    res.status(404).send("Not a favorite sell listing")
                }
            }
        }
    } catch(error){
        console.log(error);
        res.status(500).send("System Error");
    }
    
})

router.post("/addFavSearch/", async(req, res) => {

    console.log("Reached Save as favorite search");
    //console.log(req.body)
    const user_id = req.body.user_id
    const user = await Users.findById(user_id)
    try{
        console.log("Adding to favorite search")
        //console.log(user)
        delete req.body.parameters["searchCards"]
        var queryData = req.body.parameters
        //queryData["name"] = req.body.name
        //console.log(queryData)
        user.favoriteSearchCards.push(queryData)
        await user.save((err,data) => {
            if(err){
                res.status(500).send("Unable to add to favorite searches");
            } else{
                console.log("Added to favorite searches")
                res.status(200).send(data);
            }
        });
        //res.status(200).send("Test Complete")
    } catch(error){
        console.log(error);
        res.status(500).send("System Error");
    }

})

module.exports = router;