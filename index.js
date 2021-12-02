const express = require('express');
const tooltypes = require('./routes/tooltypes');
const locations = require('./routes/locations');
const tools = require('./routes/tools');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/locations', locations);
app.use('/tooltypes', tooltypes);
app.use('/tools', tools);

/*app.get('/tooltypes/', async function (req, res){
    const name = req.query.name;
    const result = await db.getToolTypeByName(name);

    if(result === null){
        return res.status(404).json({});
    }

    if(result._id){
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
});

app.post('/tooltypes', async function (req, res){
    const tooltype = req.body;
    const result = await db.addToolType(tooltype);

    if(result.insertedId){
        return res.status(201).json(result);
    }
    
    return res.status(400).json(result);
});*/

/*app.get('/tooltypes', async function (req, res){
    try{
        await client.connect();

        const result = await findMultipleListings(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBedrooms: 2,
            maximumNumberOfResults: 5
        });

        const result = await findMultipleListings(client);

        return res.status(200).json(result);
    }catch(error){
        console.log(error);
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
    
});

app.get('/singletooltype/:name', async function (req, res){
    const name = req.params.name;

    try{
        await client.connect();
        const result = await findOneListingByName(client, name);

        if(result){
            return res.status(200).json(result);
        }

        return res.status(404).json({message: "No listings found"});
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
})

app.post('/tooltypes', async (req, res) => {
    const tooltype = req.body;

    try{
        await client.connect();
        const result = await createListing(client, tooltype);
        return res.status(201).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
});

app.post('/multipletooltypes', async (req, res) => {
    const tooltypes = req.body;
    console.log(tooltypes);

    try{
        await client.connect();
        const result = await createMultipleListings(client, tooltypes);
        return res.status(201).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
  
});

app.put('/tooltypes', async (req, res) => {
    const name = req.body.name;
    const update = req.body.update;

    try{
        await client.connect();
        const result = await upsertListingByName(client, name, update);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        console.log("Closing");
        await client.close();
    }
});

app.put('/upserttooltypes', async (req, res) => {
    try{
        await client.connect();
        const result = await updateAllListingsToHavePropertyType(client);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
})

app.delete('/tooltypes', async (req, res) => {
    const listing = req.body.name;
    try{
        await client.connect();
        const result = await deleteListingByName(client, listing);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
});

app.delete('/multipletooltypes', async (req, res) => {
    const date = new Date(req.body.date);

    try{
        await client.connect();
        const result = await deleteListingsScrapedBeforeDate(client, date);
        return res.status(200).json(result);
    }catch(error){
        return res.status(400).json(error);
    }finally{
        await client.close();
    }
})*/

app.listen(PORT, () => console.log(`Palvelin käynnissä portissa ${PORT}`));