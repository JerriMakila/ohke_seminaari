const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Location = require('../models/Location');

const getLocations = async (filter) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Location.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addLocation = async (location) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Location.create(location);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, location) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Location.findByIdAndUpdate(id, location, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateByName = async (oldLocation, newLocation) => {
    const locations = await getLocations({name: oldLocation.name});

    if(locations.length > 0){
        const location = locations[0];
        const result = await updateById(location._id, newLocation);
        return result;
    }else{
        return {code: 404};
    }
}

const removeById = async (id) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Location.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {
    const locations = await getLocations({name: name});

    if(locations.length > 0){
        const id = locations[0]._id;
        const result = await removeById(id);
        return result
    }

    return {code: 404};
}

exports.getLocations = getLocations;
exports.addLocation = addLocation;
exports.updateById = updateById;
exports.updateByName = updateByName;
exports.removeById = removeById;
exports.removeByName = removeByName;