const mongoose = require('mongoose');

const schema = mongoose.Schema;

const communitydiscussion = new mongoose.Schema({
	discussiondeleted: Boolean,
	communityid: { type: schema.Types.ObjectId, ref: 'community' },
	discussiontitle: String,
	discussiondetail: String,
	discussionownername: String,
	discussionownerid: { type: schema.Types.ObjectId, ref: 'admin' },
	discussiondate: {
		type: Date,
		default: Date.now(),
	},
	discussiontags: String,
	discussioncomments: [{ type: schema.Types.ObjectId, ref: 'comment' }],
	commentslength: Number,
	discussionfeatured: Boolean,
	discussionglobal: Boolean,
});

const discussion = mongoose.model('discussion', communitydiscussion);
module.exports = discussion;
