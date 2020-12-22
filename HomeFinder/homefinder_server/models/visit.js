const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var visitSchema = new Schema({
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required: true
    },
    schedule: {type: String, required: true},
   
    listing: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'rentListing',
        required: true
    }
},
{
    versionKey: false
}
);

module.exports = mongoose.model('visit', visitSchema);