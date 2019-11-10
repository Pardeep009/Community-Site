var mongoose = require('mongoose');
var schema = mongoose.Schema;

var communitySchema = new mongoose.Schema({
    communityname : String,
    communitylocation : { type :  String , default : 'Not Added' },
    communitymembershiprule : String,
    communityowner : String,
    communityownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    communitycreatedate : String,
    communitydescription : String,
    communityimage : { type : String , default : '/defaultCommunity.jpg' },
    communityconfirm : { type : String , default : 'Not Active' },
    communityrequest : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymember : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymanager : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    invitations : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitydiscussion : [{ type: schema.Types.ObjectId, ref: 'discussions' }],
})

var community = mongoose.model('communitys',communitySchema);
module.exports = community;