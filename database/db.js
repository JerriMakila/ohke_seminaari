const { MongoClient } = require("mongodb");
const dbconfig = require('../dbconfig');
const client = new MongoClient(dbconfig.altasUri);

const db = client.db("ohke_seminaari");

const getToolTypeByName = async (name) => {
    try{
        await client.connect();
        const result = await db.collection("tool_types").findOne({name: name});
        return result;
    }catch(error){
        return error;
    }finally{
        await client.close();
    }
}

const addToolType = async (tooltype) => {
    try{
        await client.connect();
        const result = await db.collection("tool_types").insertOne(tooltype);
        return result;
    }catch(error){
        return error;
    }finally{
        await client.close();
    }
}

exports.addToolType = addToolType;
exports.getToolTypeByName = getToolTypeByName;

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