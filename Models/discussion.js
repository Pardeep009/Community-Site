const mongoose = require('mongoose');
const schema = mongoose.Schema;

const communitydiscussion = new mongoose.Schema({
    discussiondeleted : Boolean,
    communityid : { type: schema.Types.ObjectId, ref: 'communitys' },
    discussiontitle : String,
    discussiondetail : String,
    discussionownername : String,
    discussionownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    discussiondate : {
      type: Date,
      default: Date.now(),
    },
    discussiontags : String,
    discussioncomments : [{ type: schema.Types.ObjectId, ref: 'comments' }],
    commentslength : Number,
    discussionfeatured : Boolean,
    discussionglobal : Boolean,
  })


const discussion = mongoose.model('discussions',communitydiscussion);
module.exports = discussion;