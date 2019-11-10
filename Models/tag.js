var mongoose = require('mongoose');
var schema = mongoose.Schema;

var tagSchema = new mongoose.Schema({
    tagname: String,
    tagcreator: String,
    tagdate: String,
    tagflag: String,
})

var tag = mongoose.model('tags',tagSchema);
module.exports = tag;