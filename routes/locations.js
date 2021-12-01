const express = require('express');
const db = require('../database/db_locations');
let router = express.Router();

router
    .route("")

        .get(async (req, res) => {
            const filter = req.query;
            const result = await db.getLocations(filter);
            return res.status(200).json(result);
        })

        .post(async (req, res) => {
            const location = req.body;
            const result = await db.addLocation(location);

            if(result._id){
                return res.status(200).json(result);
            }

            if(result.code && result.code === 11000){
                return res.status(400).json({message: "Location with the given name already exists"});
            }

            return res.status(400).json({message: "Something went wrong, please try again"});
        })

        .put(async (req, res) => {
            const oldLocation = req.body.old;
            const newLocation = req.body.new;

            if(!oldLocation.id && !oldLocation.name){
                return res.status(400).json({message: "Location must have either name of id specified"});
            }

            let result;

            if(!oldLocation.id){
                result = await db.updateByName(oldLocation, newLocation);
            }else{
                result = await db.updateById(oldLocation.id, newLocation);
            }

            if(result.code){
                let message;

                switch(result.code){
                    case 11000:
                        message = `Location with the name '${newLocation.name} already exists'`;
                        break;
                    case 404:
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
                if(result.code === 404){
                    return res.status(404).json({message: `Location with the name ${name} not found`});
                }

                return res.status(400).json({message: `Code = ${result.code}`});
            }

            return res.status(200).json(result);
        });

module.exports = router;