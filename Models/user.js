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
	// interests: String,
	// journey: String,
	// expectations: String,
	photoname: {
		type: String,
		default: 'https://res.cloudinary.com/dpwuer7z7/image/upload/v1596008242/communitySite/dp_tqvogc.png',
	},
	githubid: String,
	switch: String,
	req: [{ type: schema.Types.ObjectId, ref: 'communitys' }], // kis kis commuity ke liye request ki hui hai
	join: [{ type: schema.Types.ObjectId, ref: 'communitys' }],
	owned: [{ type: schema.Types.ObjectId, ref: 'communitys' }],
	manager: [{ type: schema.Types.ObjectId, ref: 'communitys' }], // kis kis community ka manager not ownner
	invitations: [{ type: schema.Types.ObjectId, ref: 'communitys' }], // kis kis community ki invitations ayi hui hai
});

const user = mongoose.model('admins', userSchema);
module.exports = user;
