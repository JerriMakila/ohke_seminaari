const express = require('express');
const tooltypes = require('./routes/tooltypes');
const locations = require('./routes/locations');
const tools = require('./routes/tools');
const secrets = require('./routes/secrets');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/locations', locations);
app.use('/tooltypes', tooltypes);
app.use('/tools', tools);
app.use('/secrets', secrets);

app.listen(PORT, () => console.log(`Palvelin käynnissä portissa ${PORT}`));