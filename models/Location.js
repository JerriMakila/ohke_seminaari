const mongoose = require('mongoose');

const Location = new mongoose.Schema({
    name: {type:String, trim: true, required: true, index: true, unique: true}
});

module.exports = mongoose.model('Location', Location);