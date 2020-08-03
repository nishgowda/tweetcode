const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(express.static('views'));
require('./controllers/routes')(app);
require('./controllers/api')(app);
let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server hosted at http://locahost:${port}`));