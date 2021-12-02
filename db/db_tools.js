const dbconfig = require('../dbconfig');
const mongoose = require('mongoose');
const Tool = require('../models/Tool');

const getTools = async (filter) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tool.find(filter);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const addTool = async (tool) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tool.create(tool);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, tool) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tool.findByIdAndUpdate(id, tool, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connect(dbconfig.altasUri);
    }
}

const updateByName = async (oldTool, newTool) => {
    const tools = await getTools({name: oldTool.name});

    if(tools.length > 0){
        const tool = tools[0];
        const result = await updateById(tool._id, newTool);
        return result;
    }else{
        return {code: 404};
    }
}

const removeById = async (id) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tool.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {
    const tools = await getTools({name: name});

    if(tools.length > 0){
        const id = tools[0]._id;
        const result = await removeById(id);
        return result;
    }

    return {code: 404};
}

exports.getTools = getTools;
exports.addTool = addTool;
exports.updateById = updateById;
exports.updateByName = updateByName;
exports.removeById = removeById;
exports.removeByName = removeByName;