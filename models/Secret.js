const mongoose = require('mongoose');

const Secret = new mongoose.Schema({
    name: {type:String, trim:true, required:true, index: {unique: true}},
    location: {type:String, trim:true, required:true},
    tool: {type:String, trim:true},
    isCleared: {type:Boolean}
});

module.exports = mongoose.model('Secret', Secret);