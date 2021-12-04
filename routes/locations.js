const express = require('express');
const db = require('../db/db_locations');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query; //Filter is passed by url-parameters
            const result = await db.getLocations(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const location = req.body;
            const result = await db.addLocation(location);

            if(result._id){//If the document is succesfully added, the response object will have a key called _id
                return res.status(200).json(result);
            }

            if(result.code && result.code === 11000){// 11000 is MongoDB's code for duplicate value
                return res.status(400).json({message: "Location with the given name already exists"});
            }

            return res.status(400).json({message: "Something went wrong, please try again"});
        })

        .put(async (req, res) => {
            const oldLocation = req.body.old;
            const newLocation = req.body.new;

            if(!oldLocation.id && !oldLocation.name){//Request must have either name or id specified to find the right document from the database
                return res.status(400).json({message: "Location must have either name of id specified"});
            }

            let result;

            if(!oldLocation.id){//If id is not present, document will be updated using it's name
                result = await db.updateByName(oldLocation, newLocation);
            }else{
                result = await db.updateById(oldLocation.id, newLocation);
            }

            if(result.code){//If result has key called code in it, something has gone wrong
                let message;

                switch(result.code){
                    case 11000: //Duplicate value in a field that should be unique
                        message = `Location with the name '${newLocation.name} already exists'`;
                        break;
                    case 404: //Document not found
                        message = `Location with the name '${oldLocation.name}' was not found`;
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
                if(result.code === 404){//If the document with the given name was not found in the database
                    return res.status(404).json({message: `Location with the name ${name} not found`});
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        });

module.exports = router;