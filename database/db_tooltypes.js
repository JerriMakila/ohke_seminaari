const dbconfig = require('../dbconfig');
//const client = new MongoClient(dbconfig.altasUri);
const mongoose = require('mongoose');
const Tooltype = require('../models/Tooltype');

//const db = client.db("ohke_seminaari");
//const db = mongoose.connection;

const getToolTypes = async (filter) => {
    try{
        const connection = await mongoose.connect(dbconfig.altasUri);
        const result = await Tooltype.find(filter);
        return result;
    }catch(error){
        return error;
    } finally{
        await mongoose.connection.close();
    }
}

const addToolType = async (tooltype) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tooltype.create(tooltype);
        return result;
        // await client.connect();
        // const result = await db.collection("tool_types").insertOne(tooltype);
        // return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const updateById = async (id, tooltype) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tooltype.findByIdAndUpdate(id, tooltype, {new: true});
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }   
}

const updateByName = async (oldTooltype, newTooltype) =>{
    const tooltypes = await getToolTypes({name: oldTooltype.name});

    if(tooltypes.length > 0){
        const tooltype = tooltypes[0];
        const result = await updateById(tooltype._id, newTooltype);
        return result;
    }else{
        return {code: 404};
    }
}

const removeById = async (id) => {
    try{
        await mongoose.connect(dbconfig.altasUri);
        const result = await Tooltype.findByIdAndRemove(id);
        return result;
    }catch(error){
        return error;
    }finally{
        await mongoose.connection.close();
    }
}

const removeByName = async (name) => {
    const tooltypes = await getToolTypes({name: name});

    if(tooltypes.length > 0){
        const id = tooltypes[0]._id;
        const result = await removeById(id);
        return result
    }

    return {code: 404};
}

exports.addToolType = addToolType;
exports.getToolTypes = getToolTypes;
exports.updateByName = updateByName;
exports.updateById = updateById;
exports.removeByName = removeByName;

//const listDatabases = async (client) => {
    // const dbList = await client.db().admin().listDatabases();
    // return dbList.databases;
    // console.log("Databases:");
    // dbList.databases.forEach(db => {
    //     console.log(`- ${db.name}`);
    // });

    //const dbList = await client.db("sample_airbnb").collection("listingsAndReviews").findAll();
    //return dbList;
//}

/*const findMultipleListings = async (client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) =>{
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: { $gte: minimumNumberOfBedrooms },
        bathrooms: { $gte: minimumNumberOfBathrooms }
    }).sort({ last_review: -1 })
    .limit(maximumNumberOfResults);

    const result = await cursor.toArray();

    return result;
}*/

// const findMultipleListings = async (client) => {
//     const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find()
//         .limit(5);

//     const result = await cursor.toArray();
//     return result;
// }

// const findOneListingByName = async(client, name) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: name});
//     return result;
// }

// const createListing = async (client, newListing) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
//     return result;
// }

// const createMultipleListings = async (client, newListings) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
//     return result;
// }

// const updateListingByName = async (client, nameofListing, updatedListing) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameofListing }, {$set: updatedListing})
//     return result;
// }

// const upsertListingByName = async (client, nameofListing, updatedListing) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameofListing }, {$set: updatedListing}, {upsert: true})
//     return result;
// }

// const updateAllListingsToHavePropertyType = async (client) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({property_type: { $exists: false }},
//         {$set: {property_type: "Unknown"}});

//     return result;
// }

// const deleteListingByName = async (client, nameOfListing) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({name: nameOfListing});
//     return result;
// }

// const deleteListingsScrapedBeforeDate = async (client, date) => {
//     const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({last_scraped: { $lt: date }});
//     return result;
// }

// module.exports = {
//     createListing,
//     createMultipleListings,
//     findOneListingByName,
//     findMultipleListings,
//     updateListingByName,
//     upsertListingByName,
//     updateAllListingsToHavePropertyType,
//     deleteListingByName,
//     deleteListingsScrapedBeforeDate };