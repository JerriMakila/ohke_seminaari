const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Secret = require('../models/Secret');
const ATLAS_URI = process.env.ATLAS_URI || dbconfig.altasUri

const getSecrets = async (filter) => {//Gets all the documents that match the filter. If no filter is given, fetches every document from the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Secret.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addSecret = async (secret) => {//Adds a document to the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Secret.create(secret);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, secret) => {//Updates a document by it's ID
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Secret.findByIdAndUpdate(id, secret, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeById = async (id) => {//Removes a document by it's id
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Secret.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

exports.getSecrets = getSecrets;
exports.addSecret = addSecret;
exports.updateById = updateById;
exports.removeById = removeById;