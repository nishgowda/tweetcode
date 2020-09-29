/*
    @file: tweets.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: REST API file. Allowing for GET, PUT, POST and DELTE requests that our
    front end can make. Connects to our db to store user information.
    Passes in the obtained auth middleware via passport to secure API.
*/
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
const {homeVerifyToken, verifyToken} = require('../middleware/jwtVerify')
const {validateUpdate, validatePost} = require('../middleware/validateSchema')
const redisClient = require('../utils/redis')
const {checkTweetCache} = require('../middleware/cacheCheck')

module.exports = function (app) { // GET ALL
    app.get('/api/tweets', homeVerifyToken, async (req, res) => {
        try {

            client.query("select row_to_json(t) from (select *, ( select array_to_json(array_agg(row_to_json(d))) from (select users.* from users inner join users_code_tweets on users_code_tweets.uid=users.uid where users_code_tweets.cid=code_tweets.cid) d ) as collabs from code_tweets where status='public') t order by cid desc;", (error, results) => {
                if (error) 
                    throw error;
                return res.status(200).send(results.rows)


            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });

    // GET ONE
    app.get('/api/tweets/:cid', verifyToken, checkTweetCache, async (req, res) => {
        try {
            cid = parseInt(req.params.cid);
            client.query('select uid from users_code_tweets where cid=$1', [cid], (error, results) => {
                if (error) 
                    throw error;
                


                if (results.rowCount === 0) {
                    console.log('invalid id')
                    res.status(400).send("Invalid id");
                    return
                }
                if (!(results.rows.some(item => item.uid === req.userId))) {
                    console.log(req.userId)
                    res.status(403).send("unauthorized")
                    return
                } else {
                    client.query('select * from code_tweets where cid=$1', [cid], (err, result) => {
                        if (err) 
                            throw err;
                        const key = 'tweets-' + cid
                        redisClient.setex(key, 3600, JSON.stringify(result.rows));
                         res.status(200).send(result.rows);
                        return
                    });
                }
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }


    });

    // CREATE ONE
    app.post('/api/create', verifyToken, async (req, res) => { 

        try {
            const {error} = validatePost(req.body);
            if (error) {
                res.status(404).send(error.details[0].message);
                return;
            }
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            client.query('insert into code_tweets(code, language, title, date, owner_id, status) values($1, $2, $3, $4, $5, $6) RETURNING *', [
                req.body.code,
                req.body.language,
                req.body.title,
                date,
                req.userId,
                req.body.status
            ], (error, results) => {
                if (error) 
                    throw error;
                


                client.query('insert  into users_code_tweets(uid, cid) values($1, $2)', [
                    req.userId, results.rows[0].cid
                ], (err, _) => {
                    if (err) 
                        throw err;
                    


                    return res.status(200).send(results.rows);
                });
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }


    });
    app.post('/api/tweets-invite/:cid', verifyToken, (req, res) => {
        let cid = parseInt(req.params.cid);
        console.log(req.body)
        client.query('select uid, username from users where email=$1', [req.body.email], (err, result) => {
            if (err) 
                throw err;
            


            console.log(result.rows)
            client.query('insert into users_code_tweets(uid, cid) values($1, $2)', [
                result.rows[0].uid,
                cid
            ], (error, results) => {
                if (error) 
                    throw error;
                


                res.status(200).send(result.rows[0].username);
            })
        })

    })
    // UPDATE ONE
    app.put('/api/tweets/:cid', verifyToken, (req, res) => {
        const {error} = validateUpdate(req.body);
        if (error) {
            res.status(404).send(error.details[0].message);
            return;
        }
        let cid = parseInt(req.params.cid);
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        client.query('update code_tweets set code=$1, language=$2, title=$3, date=$4, status=$5 where cid=$6 RETURNING *', [
            req.body.code,
            req.body.language,
            req.body.title,
            date,
            req.body.status,
            cid
        ], (error, results) => {
            if (error) 
                throw error;
            


            if (results.rowCount === 0) {
                res.status(400).send("Invalid id");
                return;
            }
            return res.status(200).send(results.rows);
        })
    });
    // DELETE ONE
    app.delete('/api/tweets/:cid', verifyToken, async (req, res) => {
        try {
            let cid = parseInt(req.params.cid);
            client.query('select * from code_tweets where cid=$1', [cid], (error, results) => {
                if (error) 
                    throw error;
                if (results.rowCount === 0) {
                    res.status(400).send("Invalid id");
                    return;
                }
                if (results.rows[0].owner_id == req.userId) {
                    client.query('delete from users_code_tweets where cid=$1', [cid], (er, re) => {
                        if (er) throw er;
                        client.query('delete from review_code_tweets where cid=$1', [cid], (err, data) => {
                            if (err) throw err;
                        })
                        client.query(`delete from code_tweets where cid=$1`, [cid], (e, r) => {
                            if (e) 
                                throw e;
                         
                            if (r.rowCount === 0) {
                                res.status(400).send("Invalid id");
                                return;
                            }
                            return res.status(200).send(r.rows);
                        });
                    })
                   
                } else {
                    res.status(400).send("Unauthorized");
                    return;
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }

    });
    // GET ALL TWEETCODES FOR  USER
    app.get('/api/usertweets/:uid', verifyToken, (req, res) => {
        client.query('select row_to_json(t) from (select *, ( select array_to_json(array_agg(row_to_json(d))) from (select users.* from users inner join users_code_tweets on users_code_tweets.uid=users.uid where users_code_tweets.cid=code_tweets.cid) d ) as collabs from code_tweets) t order by cid desc', (error, results) => {
            if (error) 
                throw error;
            


            if (results.rowCount === 0) {
                res.status(400).send('invalid user')
            } else {
                var data = []
                results.rows.map(item => {
                    if (item.row_to_json.collabs.some(item => item.uid === req.userId)){
                        data.push(item);
                    }
                })
                res.status(200).send(data);
            }
        })
    })
}
