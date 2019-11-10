var mongoose = require('mongoose');
var schema = mongoose.Schema;

var communitydiscussion = new mongoose.Schema({
    discussiondeleted : Boolean,
    communityid : { type: schema.Types.ObjectId, ref: 'communitys' },
    discussiontitle : String,
    discussiondetail : String,
    discussionownername : String,
    discussionownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    discussiondate : String,
    discussiontags : String,
    discussioncomments : [{ type: schema.Types.ObjectId, ref: 'comments' }],
    commentslength : Number,
    discussionfeatured : Boolean,
    discussionglobal : Boolean,
  })


var discussion = mongoose.model('discussions',communitydiscussion);
module.exports = discussion;