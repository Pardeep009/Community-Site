const mongoose = require('mongoose');

const schema = mongoose.Schema;

const replySchema = new mongoose.Schema({
	text: String,
	flag: Boolean,
	replyownerid: { type: schema.Types.ObjectId, ref: 'admins' },
	replyowername: String,
	replyownerphotoname: String,
	replydate: {
		type: Date,
		default: Date.now(),
	},
	commentid: { type: schema.Types.ObjectId, ref: 'comments' },
});

const reply = mongoose.model('replys', replySchema);
module.exports = reply;
