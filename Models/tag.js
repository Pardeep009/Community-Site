const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
	tagname: String,
	tagcreator: String,
	tagdate: String,
	tagflag: String,
});

const tag = mongoose.model('tag', tagSchema);
module.exports = tag;
