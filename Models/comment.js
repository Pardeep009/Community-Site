var mongoose = require('mongoose');
var schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
    text : String,
    flag : Boolean,
    discussionid : {  type: schema.Types.ObjectId, ref: 'communitys' },
    commentownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    commentownername : { type: String },
    commentownerphoto : { type: String },
    commentdate : { type : String },
    reply : [{ type: schema.Types.ObjectId, ref: 'replys' }],
    replylength : Number,
  })

var comment = mongoose.model('comments',commentSchema);
module.exports=comment;