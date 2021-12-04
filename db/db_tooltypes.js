const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Tooltype = require('../models/Tooltype');
const ATLAS_URI = process.env.ATLAS_URI || dbconfig.altasUri

const getToolTypes = async (filter) => {//Gets all the documents that match the filter. If no filter is given, fetches every document from the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tooltype.find(filter);
        return result;
    }catch(error){
        return error;
    } finally{
        await mongoose.connection.close();
    }
}

const addToolType = async (tooltype) => {//Adds a document to the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tooltype.create(tooltype);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, tooltype) => {//Updates a document by it's ID
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tooltype.findByIdAndUpdate(id, tooltype, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }   
}

const updateByName = async (oldTooltype, newTooltype) =>{//Updates a document by it's name. Names in this collection are unique
    const tooltypes = await getToolTypes({name: oldTooltype.name});//Fetches the right document using the name as a filter, returns an array

    if(tooltypes.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const tooltype = tooltypes[0];
        const result = await updateById(tooltype._id, newTooltype);//Uses the documents id to update the document
        return result;
    }else{
        return {code: 404};// If the document does not exist, returns code 404
    }
}

const removeById = async (id) => {//Removes a document by it's id
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tooltype.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {//Removes a document by it's name. Names in this collection are unique
    const tooltypes = await getToolTypes({name: name});//Fetches the right document using the name as a filter, returns an array

    if(tooltypes.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const id = tooltypes[0]._id;
        const result = await removeById(id);//Uses the documents id to remove the document
        return result
    }

    return {code: 404};// If the document does not exist, returns code 404
}

exports.addToolType = addToolType;
exports.getToolTypes = getToolTypes;
exports.updateByName = updateByName;
exports.updateById = updateById;
exports.removeByName = removeByName;