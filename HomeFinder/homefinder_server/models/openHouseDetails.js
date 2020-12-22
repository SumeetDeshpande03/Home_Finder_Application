const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var openHouseDetailsSchema = new Schema({
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
   
    listing: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'sellListing',
        required: true
    }
},
{
    versionKey: false
}
);

module.exports = mongoose.model('openHouseDetails', openHouseDetailsSchema);