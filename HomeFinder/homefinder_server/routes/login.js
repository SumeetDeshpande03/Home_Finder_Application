"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
const Users = require('../models/user');
const passwordHash = require('password-hash');

/**
 * API endpoint for User Login
 */
router.post("/", async (req,res) => {
    
    console.log("Reached Login");

    Users.findOne({emailId: req.body.emailId}, (err, user) => {
        if(err){
            res.status(500).end("System Error");
        }
        if(!user){
            res.status(401).end("Invalid credentials");
        } else if(user.approvalStatus==="Pending"){
            res.status(401).end("This user has not yet been approved");
        } else if(user.approvalStatus==="Rejected"){
            res.status(401).end("This user has been rejected");
        } else if(user.approvalStatus==="Approved"){
            if (passwordHash.verify(req.body.password, user.password)) {
                const payload = { _id: user._id, name: user.name, emailId:user.emailId, role: user.role};
                console.log("success")
                const token = jwt.sign(payload,secret, {
                  expiresIn: 900000 // in seconds
                });
                let jwtToken = 'JWT ' + token;
                res.status(200).end(jwtToken);
              }
              else {
                res.status(401).end("Incorrect password");
              }
        }
    });    
})

module.exports = router;