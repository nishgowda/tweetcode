const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config()
const cors = require('cors')
const corsOption = {
    credentials: true,
    origin: true
}
app.use(cors(corsOption));
app.set("trust proxy", 1)
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const jwt = require('jsonwebtoken');


// JWT middleware to protect API endpoints
const verifyToken = (req, res, next) => {
    let token = req.cookies['x-access-token']
    if (! token) 
        return res.status(403).send({auth: false, message: 'No token provided.'});
    
    jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
        if (err) 
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        


        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();

    });
}
// JWT middleware - allows users to view website even if not logged in, but restricts access
const homeVerifyToken = (req, res, next) => {
    let token = req.cookies['x-access-token']
    if (! token) {
        req.userId = 0;
        next();
    } else {
        jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
            if (err) 
                return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
            


            // if everything good, save to request for use in other routes
            req.userId = decoded.id;
            next();
        });
    }
}
module.exports = {
    verifyToken,
    homeVerifyToken
};
