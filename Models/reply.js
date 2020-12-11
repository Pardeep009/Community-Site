const mongoose = require('mongoose');

const schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
	text: String,
	flag: Boolean,
	replyownerid: {
		type: schema.Types.ObjectId, ref: 'user',
	},
	replyowername: String,
	replyownerphotoname: String,
	replydate: {
		type: Date,
		default: Date.now(),
	},
	commentid: { type: schema.Types.ObjectId, ref: 'comment' },
});

const reply = mongoose.model('reply', replySchema);
module.exports = reply;
