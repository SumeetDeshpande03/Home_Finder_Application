"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const RentApplication = require('../models/rentApplication');
const Visit = require('../models/visit');

/**
 * API endpoint for Add Rent Application
 */
router.post("/addRentApplication", async (req,res) => {
    
    console.log("Reached Rent Application Page");

    if(req.body.approvalStatus==null || req.body.approvalStatus===""){
        req.body.approvalStatus = "Pending";
    }

    var newRentApplication = new RentApplication({
        user: req.body.applicant,
        address: req.body.address,
        creditScore: req.body.creditScore,
        ssn: req.body.ssn,
        listing: req.body.listing,
        approvalStatus: req.body.approvalStatus,
        phoneNumber: req.body.phoneNumber,
        securityDeposit:req.body.securityDeposit,
        employer:req.body.employer,
        employmentId:req.body.employmentId

    });
   console.log("Reached add rent application"+JSON.stringify(req.body));

    //User shouldnt be able to submit application for the same listing
    await RentApplication.findOne({user: req.body.applicant,listing:req.body.listing._id}, async (err, rentApplication) => {
        if(err){
            res.status(500).end("System Error");
        }
        if(rentApplication){
                res.status(400).end("Application already exists for this listing");
        } else{
        await newRentApplication.save((err,data) => {
            console.log("Trying to save application");
            if(err){
                console.log(err)
                res.status(500).end("Error in data");
            } 
            else{
                console.log("Buy Application saved successfully!")
                res.status(200).send("Application successfully saved");
            }
        })
    }
    });    
})

/**
 * API endpoint for listings all applications
 */
router.post("/getRentApplications", async (req, res) => {
    console.log("reached here"+req.body.listingId)
    RentApplication.find({listing: req.body.listingId}, (err, application) => {
      if (err) {
          res.status(500).end("System Error");
     }
     
     else {
      let payload = JSON.stringify(application);
      res.status(200).end(payload);  
       }
  }).populate('user')
  })


/**
 * API endpoint for to update status of applications
 */
router.post("/updateRentApplication", async (req, res) => {
    console.log("reached here application update"+req.body.applicationId)
    const filter={_id:req.body.applicationId};
    const update={approvalStatus:req.body.approvalStatus};
    try{
    let application = await RentApplication.findOneAndUpdate(filter, update, {
        new: true
      });
      res.status(200).send("Updated succesfully")
    }
    catch(error)
    {
        res.status(500).send("System Error");
    }
  })

  /**
 * API endpoint Schedule Visit
 */
router.post("/scheduleVisit", async (req,res) => {
    
    console.log("Reached schedule visit");

    var newVisit = new Visit({
       user:req.body.applicant,
        listing: req.body.listing._id,
        schedule: req.body.schedule
        
    });
   console.log("Reached schedule visit"+JSON.stringify(req.body));

    //User shouldnt be able to submit application for the same listing
    await Visit.findOne({user: req.body.applicant,listing:req.body.listing._id}, async (err, scheduleVisit) => {
        if(err){
            res.status(500).end("System Error");
        }
        if(scheduleVisit){
                res.status(400).end("Visit already scheduled for this user");
        } else{
        await newVisit.save((err,data) => {
            console.log("Trying to save schedule");
            if(err){
                console.log(err)
                res.status(500).end("Error in data");
            } 
            else{
                console.log("Schedule saved successfully!")
                res.status(200).send("Schedule saved successfully!");
            }
        })
    }
    });    
})
/**
 * API endpoint for getting visits scheduled
 */
router.post("/getVisitScheduled", async (req, res) => {
    console.log("reached here"+req.body.listingId)
    Visit.find({listing: req.body.listingId}, (err, visits) => {
      if (err) {
          res.status(500).end("System Error");
     }
     
     else {
      let payload = JSON.stringify(visits);
      res.status(200).end(payload);  
       }
  }).populate('user')
  })




/**
 * API endpoint for User's/Realtor's application
 */
router.post("/getMyBuyApplications", async (req, res) => {
    
    BuyApplication.find({ user: req.body.user}, (err, application) => {
      if (err) {
          res.status(500).end("System Error");
     }
     
     else {
      let payload = JSON.stringify(application);
      res.status(200).end(payload);  
       }
  })
  })

module.exports = router;