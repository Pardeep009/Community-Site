const mongoose = require('mongoose');

const schema = mongoose.Schema;

const communitySchema = new mongoose.Schema({
	communityname: String,
	communitylocation: {
		type: String, default: 'Not Added'
	},
	communitymembershiprule: String,
	communityowner: String,
	communityownerid: {
		type: schema.Types.ObjectId, ref: 'admin'
	},
	communitycreatedate: {
		type: Date,
		default: Date.now(),
	},
	communitydescription: String,
	communityimage: {
		type: String, default: '/defaultCommunity.jpg'
	},
	communityconfirm: {
		type: Boolean, default: true
	},
	communityrequest: [{
		type: schema.Types.ObjectId, ref: 'admin'
	}],
	communitymember: [{
		type: schema.Types.ObjectId, ref: 'admin'
	}],
	communitymanager: [{
		type: schema.Types.ObjectId, ref: 'admin'
	}],
	invitations: [{
		type: schema.Types.ObjectId, ref: 'admin'
	}],
	communitydiscussion: [{
		type: schema.Types.ObjectId, ref: 'discussion'
	}],
});

const community = mongoose.model('community', communitySchema);
module.exports = community;
