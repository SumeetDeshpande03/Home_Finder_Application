'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var sellListingSchema = new Schema({
    propertyName: {type: String, required: true},
    address: {type: String, required: true},
    area:{type: String, required: true},
    lotsize:{type: String, required: true},
    zipcode:{type: String, required: true},
    bedroom:{type: String, required: true},
    bathroom:{type: String, required: true},
    flooring:{type: String, required: true},
    homeType:{type: String, required: true},
    parking:{type: String, required: true},
    amenities:{type: String, required: true},
    sellingPrice:{type: String, required: true},
    additional:{type: String, required: true},
    imagePath:{type:String, required:false},
    yearBuilt: {type:String, required:true},
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required: true
    },
    openHouse: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'openhouse',
        required: false
    },
    openhouseStartDate: {type:Date, required:false},
    openhouseEndDate: {type:Date, required:false}
},
{
    versionKey: false
}
);

module.exports =  mongoose.model('sellListing', sellListingSchema);