"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const passwordHash = require('password-hash');

/**
 * API endpoint for User Signup
 */
router.post("/", async (req,res) => {
    
    console.log("Reached SignUp");

    if(req.body.approvalStatus==null || req.body.approvalStatus===""){
        req.body.approvalStatus = "Pending";
    }

    var hashedPassword = passwordHash.generate(req.body.password);

    var newUser = new Users({
        name: req.body.name,
        emailId: req.body.emailId,
        password: hashedPassword,
        role: req.body.role,
        approvalStatus: req.body.approvalStatus
    });

    await Users.findOne({emailId: req.body.emailId}, async (err, user) => {
        if(err){
            res.status(500).end("System Error");
        }
        if(user){
            res.status(500).end("User already exists");
        } else{
            await newUser.save((err,data) => {
                if(err){
                    res.status(500).end("Error in data");
                } else{
                    console.log("User has signed up successfully!")
                    res.status(200).send(data);
                }
            })
        }
    });    
})

module.exports = router;