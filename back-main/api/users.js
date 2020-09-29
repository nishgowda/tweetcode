const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors')
const corsOption = {
    credentials: true,
    origin: true
}
app.use(cors(corsOption));
const client = require('../utils/db')
const redisClient = require('../utils/redis')
const {verifyToken, homeVerifyToken} = require('../middleware/jwtVerify')
const { checkUserCache } = require('../middleware/cacheCheck')
require('dotenv').config()

module.exports = function (app) {
    app.get('/api/users', verifyToken, async (req, res) => {
        client.query('select * from users', (error, results) => {
            if (error) 
                throw error;
            


            results.rows[0].currentUid = req.userId;
            res.status(200).send(results.rows)
        });
    });

    app.get('/api/users/:uid', verifyToken, checkUserCache, async (req, res) => {
        client.query('select * from users where uid=$1', [req.params.uid], (error, results) => {
            if (error) 
                throw error;
            


            const key = 'users-' + req.params.uid
            redisClient.setex(key, 3600, JSON.stringify(results.rows));
            res.status(200).send(results.rows);
        });
    });

    // GRAB THE USERS GIVEN A TWEET CODE
    app.get('/api/tweetusers/:cid', verifyToken, (req, res) => {
        let cid = parseInt(req.params.cid)
        client.query('select users.uid, users.username, users.email, users.imageurl from users inner join users_code_tweets on users_code_tweets.uid=users.uid where users_code_tweets.cid=$1', [cid], (error, results) => {
            if (error) 
                throw error;
            


            res.status(200).send(results.rows);
            3
        })
    })
    app.get('/api/usercurrent', homeVerifyToken, (req, res) => {
        if (req.userId === 0) {
            let result = {}
            result['currentUid'] = 0;
            return res.status(200).send(result)
        } else {
            client.query("select uid, username, email, imageurl from users where uid=$1", [req.userId], (error, results) => {
                if (error) 
                    throw error;
                

                results.rows[0].currentUid = req.userId;
                return res.status(200).send(results.rows);
            })
        }

    })

}
