const mongoose = require('mongoose');
const sellListing = require('./sellListing');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    emailId: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    approvalStatus: {type: String, required: true},
    favoriteSellListings: [],
    favoriteRentListings: [],
    favoriteSearchCards: []
},
{
    versionKey: false
}
);

module.exports = mongoose.model('user', userSchema);