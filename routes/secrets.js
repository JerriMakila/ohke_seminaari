const express = require('express');
const db = require('../db/db_secrets');
const location_db = require('../db/db_locations');
const tool_db = require('../db/db_tools');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;//Filter is passed by url-parameters
            const result = await db.getSecrets(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const secret = req.body;
            
            if(!secret.location){//Location is a required field
                return res.status(400).json({message: "Location must be specified"});
            }

            const locations = await location_db.getLocations({name: secret.location});//Checking if a location with the given name exists in the collection, returns an array

            if(locations.length < 1){//If array is empty, document with the given name does not exist in the collection
                return res.status(400).json({message: `Location with the name '${secret.location}' does not exist`});
            }

            if(secret.tool){
                const tools = await tool_db.getTools({name: secret.tool}); //Checking if a document with the given name exists in the collection, returns an array

                if(tools.length < 1){//If array is empty, document with the given name does not exist in the collection
                    return res.status(400).json({message: `Tool with the name ${secret.tool} does not exist`});
                }
            }

            const result = await db.addSecret(secret);

            if(result._id){//If the document is added succesfully, result has a key '_id' in it
                return res.status(200).json(result);
            }

            if(result.code){//If result has a key 'code' in it, something has gone wrong
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

            if(!oldSecret.id){//Id is the only unique field in this collection, so it must be specified
                return res.status(400).json({message: "SecretId must be specified"});
            }

            if(newSecret.location){//Checking if the location exists in the collection
                const locations = await location_db.getLocations({name: newSecret.location});//Getting the document by it's name, returns an array

                if(locations.length < 1){//If document with the given name was not found in the collection, the array is empty
                    return res.status(400).json({message: `Location with name '${newSecret.location}'' does not exist`});
                }
            }

            if(newSecret.tool){//Making the same check in here as above
                const tools = await tool_db.getTools({name: newSecret.tool});

                if(tools.length < 1){
                    return res.status(400).json({message: `Tool with name '${newSecret.tool}' does not exist`});
                }
            }

            const result = await db.updateById(oldSecret.id, newSecret);

            if(!result){//Returns 'null' if a document with the gicen id does not exist
                return res.status(400).json({message: "Secret with the given id does not exist"});
            }

            return res.status(200).json(result);
        });

router
    .route("/:id")
        .delete(async (req, res) => {
            const id = req.params.id;
            const result = await db.removeById(id);

            if(!result){//Returns 'null' if a document with the gicen id does not exist
                return res.status(404).json({message: "Secret with the given id not found"});
            }

            return res.status(200).json(result);
        })

module.exports = router;