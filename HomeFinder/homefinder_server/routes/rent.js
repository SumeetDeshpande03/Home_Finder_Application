
"use strict"

const app = require("../app");
const express = require("express");
const router = express.Router();
const Users = require('../models/user');
const RentListing = require('../models/rentListing');
const multer  = require('multer');
const path = require('path');
/**
 * API endpoint for Adding new rent listing 
 */
router.post("/addRentListing/", async (req, res) => {
    console.log("reached add rent listing"+JSON.stringify(req.body))
    
    var newRentListing = new RentListing({
        propertyName: req.body.propertyName,
        address: req.body.address,
        lotsize:req.body.lotsize,
        zipcode:req.body.zipcode,
        bedroom:req.body.bedroom,
        bathroom:req.body.bathroom,
        flooring:req.body.flooring,
        homeType:req.body.homeType,
        parking:req.body.parking,
        amenities:req.body.amenities,
        leaseTerm:req.body.leaseTerm,
        additional:req.body.additional,
        availabilityDate:req.body.availabilityDate,
        area:req.body.area,
        price:req.body.price,
        yearBuilt:req.body.yearBuilt,
        user:req.body.user
        
    });
console.log("reached here");
    await RentListing.findOne({propertyName: req.body.propertyName}, async (err, listing) => {
        if(err){
            console.log(err);
            res.status(500).end("System Error");
        }
        if(listing){
            res.status(500).end("Listing already exists");
        } else{
            await newRentListing.save((err,data) => {
                if(err){
                    console.log(err);
                    res.status(500).end("Error in data");
                } else{
                    console.log("Listing added successfully!")
                    res.status(200).send(data);
                }
            })
        }
    });       
})
/**
 * API endpoint for User's/Realtor's rent listings and all details 
 */
router.post("/getMyRentListings", async (req, res) => {
    
  RentListing.find({ user: req.body.user}, (err, listing) => {
    if (err) {
        res.status(500).end("System Error");
   }
   
   else {
    let payload = JSON.stringify(listing);
    res.status(200).end(payload);  
     }
})
})

/**
 * API endpoint for User's/Realtor's to remove rent listing 
 */
router.post("/removeRentListing", async (req, res) => {
    console.log("Reached deletion")
    RentListing.deleteOne({ _id: req.body.listingId}, (err, successFlag) => {
        if (err) {
           
            res.status(500).end("System Error");
       }
       else{
        res.status(200).end("Deleted listing successfully"); 
        
       }
    })
  })

  /**
 * API endpoint for User's/Realtor's to edit rental listing 
 */
router.post("/editRentalListing", async (req, res) => {
    console.log("Reached edit for rental listing")
    RentListing.findOneAndUpdate({ _id: req.body.listingId}, 
            {
                propertyName: req.body.propertyName,
                address: req.body.address,
                lotsize:req.body.lotsize,
                zipcode:req.body.zipcode,
                bedroom:req.body.bedroom,
                bathroom:req.body.bathroom,
                flooring:req.body.flooring,
                homeType:req.body.homeType,
                parking:req.body.parking,
                amenities:req.body.amenities,
                leaseTerm:req.body.leaseTerm,
                additional:req.body.additional,
                availabilityDate:req.body.availabilityDate,
                price:req.body.price,
                yearBuilt:req.body.yearBuilt,
                user:req.body.user
                //user:req.body.user
            },
            {
              new: true
            },
            (err, updatedListing) => {
              if (err) {
                res.status(500).end("System Error"); 
              }
              if (updatedListing) {
                const payload={successFlag:"true"};
                res.status(200).end("Success"); 
              }
              
            }
          );
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
  /**
 * API endpoint for User's/Realtor's to upload rent listings image 
 */
router.post("/uploadImage",upload.single('file'), (req, res) => {
        
            console.log("reached here");
            console.log(req.file.path);
            console.log(req.body.listingId);
            console.log("Reached edit for rental listing")
    RentListing.findOneAndUpdate({ _id: req.body.listingId}, 
            {
                
                imagePath:req.file.path
                
            },
            {
              new: true
            },
            (err, updatedListing) => {
              if (err) {
                res.status(500).end("System Error"); 
              }
              if (updatedListing) {
                const payload={successFlag:"true"};
                res.status(200).end("File uploaded successfully"); 
              }
              
            }
          );
        }); 
    


module.exports = router;