const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser')
const aegis = new AegisNet(connectionString);

app.use(cookieParser())
require('./api/tweets')(app);
require('./api/reviews')(app);
require('./api/users')(app);
require('./api/search')(app);
let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server hosted at http://locahost:${port}`));
