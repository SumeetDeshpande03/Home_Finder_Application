const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var rentApplicationSchema = new Schema({
    ssn: {type: String, required: true},
    address: {type: String, required: true},
    creditScore: {type: String, required: true},
    approvalStatus: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    securityDeposit: {type: String, required: true},
    employer: {type: String, required: true},
    employmentId:{type: String, required: true},
    user: {
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
        required: true
      },
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

module.exports = mongoose.model('rentApplication', rentApplicationSchema);