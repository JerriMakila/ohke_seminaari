const express = require('express');
const db = require('../db/db_secrets');
const location_db = require('../db/db_locations');
const tool_db = require('../db/db_tools');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;
            const result = await db.getSecrets(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const secret = req.body;
            
            if(!secret.location){
                return res.status(400).json({message: "Location must be specified"});
            }

            const locations = await location_db.getLocations({name: secret.location});

            if(locations.length < 1){
                return res.status(400).json({message: `Location with the name '${secret.location}' does not exist`});
            }

            if(secret.tool){
                const tools = await tool_db.getTools({name: secret.tool});

                if(tools.length < 1){
                    return res.status(400).json({message: `Tool with the name ${secret.tool} does not exist`});
                }
            }

            const result = await db.addSecret(secret);

            if(result._id){
                return res.status(200).json(result);
            }

            if(result.code){
               return res.status(400).json({message: `code = ${result.code}`});
            }

            return res.status(400).json({
                message: "Something went wrong, please try again",
                data: result
            });
        })

        .put(async (req, res) => {
            const oldSecret = req.body.old;
            const newSecret = req.body.new;

            if(!oldSecret.id){
                return res.status(400).json({message: "SecretId must be specified"});
            }

            if(newSecret.location){
                const locations = await location_db.getLocations({name: newSecret.location});

                if(locations.length < 1){
                    return res.status(400).json({message: `Location with name '${newSecret.location}'' does not exist`});
                }
            }

            if(newSecret.tool){
                const tools = await tool_db.getTools({name: newSecret.tool});

                if(tools.length < 1){
                    return res.status(400).json({message: `Tool with name '${newSecret.tool}' does not exist`});
                }
            }

            const result = await db.updateById(oldSecret.id, newSecret);

            if(!result){
                return res.status(400).json({message: "Secret with the given id does not exist"});
            }

            return res.status(200).json(result);
        });

router
    .route("/:id")
        .delete(async (req, res) => {
            const id = req.params.id;
            const result = await db.removeById(id);

            if(!result){
                return res.status(404).json({message: "Secret with the given id not found"});
            }

            return res.status(200).json(result);
        })

module.exports = router;