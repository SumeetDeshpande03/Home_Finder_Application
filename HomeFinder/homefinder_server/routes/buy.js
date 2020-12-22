"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const BuyApplication = require('../models/buyApplication');

/**
 * API endpoint for Add Buy Application
 */
router.post("/addBuyApplication", async (req,res) => {
    
    console.log("Reached Buy Page");

    if(req.body.approvalStatus==null || req.body.approvalStatus===""){
        req.body.approvalStatus = "Pending";
    }

    var newBuyApplication = new BuyApplication({
        user: req.body.user,
        address: req.body.address,
        creditScore: req.body.creditScore,
        downPayment: req.body.downPayment,
        ssn: req.body.ssn,
        listing: req.body.listing,
        offerPrice: req.body.offerPrice,
        approvalStatus: req.body.approvalStatus,
        phoneNumber: req.body.phoneNumber
    });
    console.log(newBuyApplication);

    //User shouldnt be able to submit application for the same listing
    await BuyApplication.findOne({user: req.body.user,listing:req.body.listing}, async (err, buyApplication) => {
        if(err){
            res.status(500).end("System Error");
        }
        if(buyApplication){
            res.status(500).end("Application already exists for this listing");
        } else{
        await newBuyApplication.save((err,data) => {
            console.log("Trying to save application");
            if(err){
                res.status(500).end("Error in data");
            } 
            else{
                console.log("Buy Application saved successfully!")
                res.status(200).send(data);
            }
        })
    }
    });    
})

/**
 * API endpoint for User's/Realtor's application
 */
router.post("/getMyBuyApplications", async (req, res) => {
    BuyApplication.find({ listing: req.body.listingId}, (err, application) => {
      if (err) {
          res.status(500).end("System Error");
     }
     
     else {
      console.log(application);
      let payload = JSON.stringify(application);
      res.status(200).end(payload);  
       }
  }).populate('user')
  })

  /**
 * API endpoint for User's/Realtor's to remove application
 */
router.post("/removeBuyApplication", async (req, res) => {
    console.log("Reached deletion")
    BuyApplication.deleteOne({ _id: req.body.listingId}, (err, successFlag) => {
        if (err) {
           
            res.status(500).end("System Error");
       }
       else{
        res.status(200).end("Deleted listing successfully"); 
        
       }
    })
  })



  /**
 * API endpoint for to update status of applications
 */
router.post("/updateBuyApplication", async (req, res) => {
    console.log("reached here application update"+req.body.applicationId)
    const filter={_id:req.body.applicationId};
    const update={approvalStatus:req.body.approvalStatus};
    try{
    let application = await BuyApplication.findOneAndUpdate(filter, update, {
        new: true
      });
      res.status(200).send("Updated succesfully")
    }
    catch(error)
    {
        res.status(500).send("System Error");
    }
  })

module.exports = router;