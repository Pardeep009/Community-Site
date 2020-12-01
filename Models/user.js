const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	gender: String,
	city: String,
	phone: String,
	role: String,
	dob: String,
	status: String,
	state: String,
	photoname: {
		type: String,
		default: 'https://res.cloudinary.com/dpwuer7z7/image/upload/v1596008242/communitySite/dp_tqvogc.png',
	},
	githubid: String,
	switch: String,
	req: [{
		type: schema.Types.ObjectId, ref: 'community'
	}], // array holding id's of communities which are requested by person to join
	join: [{
		type: schema.Types.ObjectId, ref: 'community'
	}], // array holding id's of communities which are joined by person
	owned: [{
		type: schema.Types.ObjectId, ref: 'community'
	}], // array holding id's of communities which are owned by person
	manager: [{
		type: schema.Types.ObjectId, ref: 'community'
	}], // array holding id's of communities which are managed by person
	invitations: [{
		type: schema.Types.ObjectId, ref: 'community'
	}], // array holding id's of communities which have invited the person to join
});

const user = mongoose.model('admin', userSchema);
module.exports = user;
