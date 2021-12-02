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

            if(result._id){
                return res.status(200).json(result);
            }

            if(result.code && result.code === 11000){
                return res.status(400).json({message: "Tooltype with the given name already exists"});
            }

            return res.status(400).json({message: "Something went wrong, please try again", data: result});
            
        })
        
        .put(async (req, res) => {
            const oldTooltype = req.body.old;
            const newTooltype = req.body.new;

            if(!oldTooltype.id && !oldTooltype.name){
                return res.status(400).json({message: "Tooltype must have either name or id specified"});
            }

            let result;

            if(!oldTooltype.id){
                result = await db.updateByName(oldTooltype, newTooltype);
            }else{
                result = await db.updateById(oldTooltype.id, newTooltype);
            }

            if(result.code){
                let message;

                switch(result.code){
                    case 11000:
                        message = `Tooltype with the name '${newTooltype.name}' already exists`
                        break;
                    case 404:
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
                if(result.code === 404){
                    return res.status(404).json({message: `Tooltype with the name '${name}' not found`});  
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        });


module.exports = router;