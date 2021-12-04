const express = require('express');
const db = require('../db/db_tools');
const tooltype_db = require('../db/db_tooltypes');
const scripts = require('../scripts/scripts');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;//Filter is passed by url-parameters
            const result = await db.getTools(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const tool = req.body;
            let tooltype;

            if(tool.tooltype){
                const tooltypes = await tooltype_db.getToolTypes({_id: tool.tooltype});//Checking if the document exists in the database, returns an array
                
                if(tooltypes.length < 1 || tooltypes.reason){//If the document does not exist, the array is empty. Also if the id does not match the regexp, an object with a key 'reason' is returned 
                    return res.status(400).json({message: "Invalid TooltypeID"});
                }

                tooltype = tooltypes[0];
            }else{
                return res.status(400).json({message: "Tooltype must be specified"});
            }

            const result = await db.addTool(tool);

            if(result._id){//If the document is added succesfully, the result has a key '_id' in it
                const response = scripts.toObject(result._doc);
                response.tooltype = tooltype;
                return res.status(200).json(response);
            }

            if(result.code){
                if(result.code === 11000){ //Code for a duplicate value in a field that should be unique
                    return res.status(400).json({message: "Tool with the given name already exists"});
                }

                return res.status(400).json({message: `code = ${result.code}`});
            }

            return res.status(400).json({
                message: "Something went wrong, please try again",
                data: result
            });
        })

        .put(async (req, res) => {
            const oldTool = req.body.old;
            const newTool = req.body.new;

            if(!oldTool.id && !oldTool.name){//The request should contain either a name or id for the document that needs to be updated
                return res.status(400).json({message: "Tool must have either name or id specified"});
            }

            if(newTool.tooltype){
                const tooltypes = await tooltype_db.getToolTypes({_id: newTool.tooltype});//Checking if the document exists in the database

                if(tooltypes.length < 1){//If the array is empty, the document was not found in the collection
                    return res.status(400).json({message: `Tooltype with id '${newTool.tooltype}' not found`});
                }
            }

            let result;

            if(!oldTool.id){//If id is not present, the document will be updated by it's name
                result = await db.updateByName(oldTool, newTool);
            }else{
                result = await db.updateById(oldTool.id, newTool);
            }

            if(result.code){//If result has key 'code' in it, something has gone wrong
                let message;
                
                switch(result.code){
                    case 11000: //Code for a duplicate value in a field that should be unique
                        message = `Tool with the name '${newTool.name}' already exists`;
                        break;
                    case 404://Document not found in the collection
                        message = `Tool with the name '${oldTool.name}' was not found`;
                        break;
                    default:
                        message = `code = ${result.code}`;
                }

                return res.status(400).json({message: message});
            }

            return res.status(200).json(result);
        });

router
    .route("/:name")
        .delete(async (req, res) => {
            const name = req.params.name;
            const result = await db.removeByName(name);

            if(result.code){//If the result has key 'code' in it, something has gone wrong
                if(result.code === 404){//Document not found in the collection
                    return res.status(404).json({message: `Tool with the name '${name}' not found`});
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        })

module.exports = router;