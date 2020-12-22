const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var buyApplicationSchema = new Schema({
    ssn: {type: String, required: true},
    offerPrice: {type: Number, required: true},
    address: {type: String, required: true},
    downPayment: {type: String, required: true},
    creditScore: {type: String, required: true},
    approvalStatus: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required: true
      },
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

module.exports = mongoose.model('buy', buyApplicationSchema);