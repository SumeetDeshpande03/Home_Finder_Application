'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var rentListingSchema = new Schema({
    propertyName: {type: String, required: true},
    address: {type: String, required: true},
    lotsize:{type: String, required: true},
    zipcode:{type: String, required: true},
    bedroom:{type: String, required: true},
    bathroom:{type: String, required: true},
    flooring:{type: String, required: true},
    homeType:{type: String, required: true},
    parking:{type: String, required: true},
    amenities:{type: String, required: true},
    leaseTerm:{type: String, required: true},
    availabilityDate:{type: String, required: true},
    additional:{type: String, required: false},
    imagePath:{type:String, required:false},
    area:{type: String, required: true},
    price:{type: String, required: true},
    yearBuilt:{type: String, required: true},

    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required: true
      }
},
{
    versionKey: false
}
);

module.exports =  mongoose.model('rentListing', rentListingSchema);