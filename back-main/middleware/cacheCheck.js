const express = require('express');
const app = express();
app.use(express.json());
const redisClient = require('../utils/redis')
const cookieParser = require('cookie-parser')
require('dotenv').config()
app.use(cookieParser())
const cors = require('cors')
const corsOption = {
    credentials: true,
    origin: true
}
app.use(cors(corsOption));

const checkTweetCache = (req, res, next) => {
    const {cid} = req.params;
    let key = 'tweets-' + cid;
    redisClient.get(key, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        // if no match found
        if (data != null) {
            res.send(data);
        } else { // proceed to next middleware function
            next();
        }
    });
};

const checkUserCache = (req, res, next) => {
    const {uid} = req.params;
    let key = 'users-' + uid;
    redisClient.get(key, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        // if no match found
        if (data != null) {
            res.send(data);
        } else { // proceed to next middleware function
            next();
        }
    });
}

const checkSearchCache = (req, res, next) => {
    const { qid } = req.params;
    let key = 'search-' + qid;
    redisClient.get(key, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err)
        }
        if (data != null) {
            res.send(data);
        } else { // proceed to next middleware function
            next();
        }
    })
}

const checkReviewCache = (req, res, next) => {
    const { cid } = req.params;
    let key = 'review-' + cid;
    redisClient.get(key, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err)
        }
        if (data != null) {
            res.send(data);
        } else { // proceed to next middleware function
            next();
        }
    })
}

module.exports = {
    checkTweetCache,
    checkUserCache,
    checkSearchCache,
    checkReviewCache
};
