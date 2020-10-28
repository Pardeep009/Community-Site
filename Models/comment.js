const mongoose = require('mongoose');

const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
	text: String,
	flag: Boolean,
	discussionid: { type: schema.Types.ObjectId, ref: 'communitys' },
	commentownerid: { type: schema.Types.ObjectId, ref: 'admins' },
	commentownername: { type: String },
	commentownerphoto: { type: String },
	commentdate: {
		type: Date,
		default: Date.now(),
	},
	reply: [{ type: schema.Types.ObjectId, ref: 'replys' }],
	replylength: Number,
});

const comment = mongoose.model('comments', commentSchema);
module.exports = comment;
