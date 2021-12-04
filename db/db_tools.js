const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const ATLAS_URI = process.env.ATLAS_URI || dbconfig.altasUri

const getTools = async (filter) => {//Gets all the documents that match the filter. If no filter is given, fetches every document from the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tool.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addTool = async (tool) => {//Adds a document to the collection
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tool.create(tool);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, tool) => {//Updates a document by it's ID
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tool.findByIdAndUpdate(id, tool, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateByName = async (oldTool, newTool) => {//Updates a document by it's name. Names in this collection are unique
    const tools = await getTools({name: oldTool.name});//Fetches the right document using the name as a filter, returns an array

    if(tools.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const tool = tools[0];
        const result = await updateById(tool._id, newTool);//Uses the documents id to update the document
        return result;
    }else{
        return {code: 404};// If the document does not exist, returns code 404
    }
}

const removeById = async (id) => {//Removes a document by it's id
    try{
        await mongoose.connect(ATLAS_URI);
        const result = await Tool.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {//Removes a document by it's name. Names in this collection are unique
    const tools = await getTools({name: name});//Fetches the right document using the name as a filter, returns an array

    if(tools.length > 0){//If document with the given name does not exist in the collection, the array is empty
        const id = tools[0]._id;
        const result = await removeById(id);//Uses the documents id to remove the document
        return result;
    }

    return {code: 404};// If the document does not exist, returns code 404
}

exports.getTools = getTools;
exports.addTool = addTool;
exports.updateById = updateById;
exports.updateByName = updateByName;
exports.removeById = removeById;
exports.removeByName = removeByName;