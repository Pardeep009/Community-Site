var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    gender: String,
    city: String,
    phone: String,
    role: String,
    dob : String,
    status : String,
    state: String,
    interests: String,
    journey: String,
    expectations: String,
    photoname: {type : String, default:"/dp.png"},
    githubid : String,
    switch: String,
    req : [{ type: schema.Types.ObjectId, ref: 'communitys' }],            // kis kis commuity ke liye request ki hui hai
    join : [{ type: schema.Types.ObjectId, ref: 'communitys' }],
    owned : [{ type: schema.Types.ObjectId, ref: 'communitys' }],
    manager : [{ type: schema.Types.ObjectId, ref: 'communitys' }],           // kis kis community ka manager not ownner
    invitations : [{ type: schema.Types.ObjectId, ref: 'communitys' }],     // kis kis community ki invitations ayi hui hai
})

var user = mongoose.model('admins', userSchema);
module.exports = user;