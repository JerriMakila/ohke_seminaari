const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
    name: {type:String, trim:true, required:true},
    tooltype: {type:String, trim:true, required:true}
});

module.exports = mongoose.model('Profile', Profile);