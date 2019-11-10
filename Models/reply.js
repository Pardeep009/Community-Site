var mongoose = require('mongoose');
var schema = mongoose.Schema;

var replySchema = new mongoose.Schema({
    text : String,
    flag : Boolean,
    replyownerid : { type : schema.Types.ObjectId, ref: 'admins' },
    replyowername : String,
    replyownerphotoname : String,
    replydate : String,
    commentid : { type: schema.Types.ObjectId, ref: 'comments' },
  })

var reply = mongoose.model('replys',replySchema);
module.exports = reply;