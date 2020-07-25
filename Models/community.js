const mongoose = require('mongoose');
const schema = mongoose.Schema;

const communitySchema = new mongoose.Schema({
    communityname : String,
    communitylocation : { type :  String , default : 'Not Added' },
    communitymembershiprule : String,
    communityowner : String,
    communityownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    communitycreatedate : {
        type: Date,
        default: Date.now(),
    },
    communitydescription : String,
    communityimage : { type : String , default : '/defaultCommunity.jpg' },
    communityconfirm : { type : Boolean , default : true },
    communityrequest : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymember : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymanager : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    invitations : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitydiscussion : [{ type: schema.Types.ObjectId, ref: 'discussions' }],
})

const community = mongoose.model('communitys',communitySchema);
module.exports = community;