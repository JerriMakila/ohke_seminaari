const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Secret = require('../models/Secret');

const getSecrets = async (filter) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Secret.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addSecret = async (secret) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Secret.create(secret);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, secret) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Secret.findByIdAndUpdate(id, secret, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeById = async (id) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
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