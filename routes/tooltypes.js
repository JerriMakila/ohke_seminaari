const express = require('express');
const db = require('../db/db_tooltypes');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;
            const result = await db.getToolTypes(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const tooltype = req.body;
            const result = await db.addToolType(tooltype);

            if(result._id){//If adding was succesful, the result has key '_id' in it
                return res.status(200).json(result);
            }

            if(result.code && result.code === 11000){ //Code for a duplicate value in a field that should be unique
                return res.status(400).json({message: "Tooltype with the given name already exists"});
            }

            return res.status(400).json({message: "Something went wrong, please try again", data: result});
            
        })
        
        .put(async (req, res) => {
            const oldTooltype = req.body.old;
            const newTooltype = req.body.new;

            if(!oldTooltype.id && !oldTooltype.name){//Either name or id of the document is needed in order to update it
                return res.status(400).json({message: "Tooltype must have either name or id specified"});
            }

            let result;

            if(!oldTooltype.id){//If id is not present, document will be updated by it's name
                result = await db.updateByName(oldTooltype, newTooltype);
            }else{
                result = await db.updateById(oldTooltype.id, newTooltype);
            }

            if(result.code){//If result has key 'code' in it, something has gone wrong
                let message;

                switch(result.code){
                    case 11000://Code for a duplicate value in a field that should be unique
                        message = `Tooltype with the name '${newTooltype.name}' already exists`
                        break;
                    case 404://Document not found in the collection
                        message = `Tooltype with the name '${oldTooltype.name}' was not found`;
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

            if(result.code){
                if(result.code === 404){//Document not found in the collection
                    return res.status(404).json({message: `Tooltype with the name '${name}' not found`});  
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        });


module.exports = router;