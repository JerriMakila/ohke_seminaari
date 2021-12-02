const express = require('express');
const db = require('../db/db_tools');
const tooltype_db = require('../db/db_tooltypes');
const scripts = require('../scripts/scripts');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;
            const result = await db.getTools(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const tool = req.body;
            let tooltype;

            if(tool.tooltype){
                const tooltypes = await tooltype_db.getToolTypes({_id: tool.tooltype});
                //console.log(tooltypes);
                
                if(tooltypes.length < 1 || tooltypes.reason){
                    return res.status(400).json({message: "Invalid TooltypeID"});
                }

                tooltype = tooltypes[0];
            }else{
                return res.status(400).json({message: "Tooltype must be specified"});
            }

            const result = await db.addTool(tool);

            if(result._id){
                const response = scripts.toObject(result._doc);
                response.tooltype = tooltype;
                return res.status(200).json(response);
            }

            if(result.code){
                if(result.code === 11000){
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

            if(!oldTool.id && !oldTool.name){
                return res.status(400).json({message: "Tool must have either name or id specified"});
            }

            if(newTool.tooltype){
                const tooltypes = await tooltype_db.getToolTypes({_id: newTool.tooltype});

                if(tooltypes.length < 1){
                    return res.status(400).json({message: `Tooltype with id '${newTool.tooltype}' not found`});
                }
            }

            let result;

            if(!oldTool.id){
                result = await db.updateByName(oldTool, newTool);
            }else{
                result = await db.updateById(oldTool.id, newTool);
            }

            if(result.code){
                let message;
                
                switch(result.code){
                    case 11000:
                        message = `Tool with the name '${newTool.name}' already exists`;
                        break;
                    case 404:
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

            if(result.code){
                if(result.code === 404){
                    return res.status(404).json({message: `Tool with the name '${name}' not found`});
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        })

module.exports = router;