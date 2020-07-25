const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tagSchema = new mongoose.Schema({
    tagname: String,
    tagcreator: String,
    tagdate: String,
    tagflag: String,
})

const tag = mongoose.model('tags',tagSchema);
module.exports = tag;