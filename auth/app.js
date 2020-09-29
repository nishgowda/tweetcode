/*
@file: routes.js
@author: Nish Gowda
@data: 08/03/20
@about: Routing file that redirects to our static html, css and client side js files.
Also initializes passport and sessison.
*/
const express = require('express');
const app = express();
app.use(express.json());
require('./config/pass');
require('./middleware/routes')(app);
require('dotenv').config();
let port = process.env.PORT || 3004
console.log(process.env.GOOGLE_REDIRECT_URI)

app.listen(port, () => console.log(`Server hosted at http://localhost:${port}`));
