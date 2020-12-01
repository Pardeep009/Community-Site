const mongoose = require('mongoose');

const schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
	text: String,
	flag: Boolean,
	discussionid: {
		type: schema.Types.ObjectId, ref: 'community'
	},
	commentownerid: {
		type: schema.Types.ObjectId, ref: 'admin'
	},
	commentownername: {
		type: String
	},
	commentownerphoto: {
		type: String
	},
	commentdate: {
		type: Date,
		default: Date.now(),
	},
	reply: [{ type: schema.Types.ObjectId, ref: 'reply' }],
	replylength: Number,
});

const comment = mongoose.model('comment', commentSchema);
module.exports = comment;
