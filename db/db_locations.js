const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Location = require('../models/Location');
const ATLAS_URI = process.env.ATLAS_URI || dbconfig.altasUri

const getLocations = async (filter) => { //Gets all the documents that match the filter. If no filter is given, fetches every document from the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Location.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addLocation = async (location) => { //Adds a document to the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Location.create(location);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, location) => {//Updates a document by it's ID
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Location.findByIdAndUpdate(id, location, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateByName = async (oldLocation, newLocation) => {//Updates a document by it's name. Names in this collection are unique
    const locations = await getLocations({name: oldLocation.name}); //Fetches the right document using the name as a filter, returns an array

    if(locations.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const location = locations[0];
        const result = await updateById(location._id, newLocation);//Uses the documents id to update the document
        return result;
    }else{
        return {code: 404};// If the document does not exist, returns code 404
    }
}

const removeById = async (id) => {//Removes a document by it's id
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Location.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {//Removes a document by it's name. Names in this collection are unique
    const locations = await getLocations({name: name});//Fetches the right document using the name as a filter, returns an array

    if(locations.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const id = locations[0]._id;
        const result = await removeById(id);//Uses the documents id to remove the document
        return result
    }

    return {code: 404};// If the document does not exist, returns code 404
}

exports.getLocations = getLocations;
exports.addLocation = addLocation;
exports.updateById = updateById;
exports.updateByName = updateByName;
exports.removeById = removeById;
exports.removeByName = removeByName;