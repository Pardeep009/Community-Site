const mongoose = require('mongoose');

const schema = mongoose.Schema;

const communitySchema = new mongoose.Schema({
	communityname: String,
	communitylocation: {
		type: String, default: 'Not Added',
	},
	communitymembershiprule: String,
	communityowner: String,
	communityownerid: {
		type: schema.Types.ObjectId, ref: 'user',
	},
	communitycreatedate: {
		type: Date,
		default: Date.now(),
	},
	communitydescription: String,
	communityimage: {
		type: String, default: '/defaultCommunity.jpg',
	},
	communityconfirm: {
		type: Boolean, default: true,
	},
	communityrequest: [{
		type: schema.Types.ObjectId, ref: 'user',
	}],
	communitymember: [{
		type: schema.Types.ObjectId, ref: 'user',
	}],
	communitymanager: [{
		type: schema.Types.ObjectId, ref: 'user',
	}],
	invitations: [{
		type: schema.Types.ObjectId, ref: 'user',
	}],
	communitydiscussion: [{
		type: schema.Types.ObjectId, ref: 'discussion',
	}],
});

const community = mongoose.model('community', communitySchema);
module.exports = community;
