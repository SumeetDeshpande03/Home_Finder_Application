"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');

/**
 * API endpoint for Getting All Users with role:User
 */
router.get("/getAllUsers/", async (req, res) => {
    try{
        const users = await Users.find({role:"User"});
        res.status(200).send(users)  
    } catch(error){
        res.status(500).send("System Error");
    }
})

/**
 * API endpoint for Getting All Users with role:Realtor
 */
router.get("/getAllRealtors/", async (req, res) => {
    try{
        const realtors = await Users.find({role:"Realtor"});
        res.status(200).send(realtors)  
    } catch(error){
        res.status(500).send("System Error");
    }
})

/**
 * API endpoint for Updating approval status for users with role:User
 */
router.post("/userApprovalStatusUpdate/", async (req, res) => {
    console.log("reached approval status change"+JSON.stringify(req.body))
    const filter={emailId:req.body.userEmailId, role:'User'};
    const update={approvalStatus:req.body.approvalStatus};
    try{
    let user = await Users.findOneAndUpdate(filter, update, {
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
 * API endpoint for Updating approval status for users with role:Realtor
 */
router.post("/realtorApprovalStatusUpdate/", async (req, res) => {
    console.log("reached approval status change"+JSON.stringify(req.body))
    const filter={emailId:req.body.realtorEmailId, role:'Realtor'};
    const update={approvalStatus:req.body.approvalStatus};
    try{
    let user = await Users.findOneAndUpdate(filter, update, {
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