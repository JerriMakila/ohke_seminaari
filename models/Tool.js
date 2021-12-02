const mongoose = require('mongoose');

const Tool = new mongoose.Schema({
    name: {type:String, trim:true, required:true, index: {unique: true}},
    tooltype: {type:String, trim:true, required:true}
});

module.exports = mongoose.model('Tool', Tool);