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
const {verifyToken} = require('../middleware/jwtVerify')
const {valideReviewPost, valideReviewUpdate} = require('../middleware/validateSchema')
const redisClient = require('../utils/redis')
const {checkReviewCache} = require('../middleware/cacheCheck')

module.exports =  app => { // GET ALL
    app.get('/api/reviews', verifyToken, async (_, res) => {
        try {
            client.query('select row_to_json(t) from (select *, ( select array_to_json(array_agg(row_to_json(d))) from (select users.uid, users.username, users.email, users.imageurl from users inner join user_reviews on user_reviews.uid=users.uid where user_reviews.rid=reviews.rid) d ) as reviewers from reviews) t order by rid desc;', (err, result) => {
                if (err) throw err;
                return res.status(200).send(result.rows)
            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });
    app.get('/api/reviews/:cid', verifyToken, checkReviewCache, async (req, res) => {
        try {
            const { cid } = req.params;
            client.query('select row_to_json(t) from (select *, ( select array_to_json(array_agg(row_to_json(d))) from (select users.uid, users.username, users.email, users.imageurl from users inner join user_reviews on reviews.owner_id=users.uid where user_reviews.rid=reviews.rid) d ) as reviewers from reviews where cid=$1) t order by rid desc;',[cid], (err, result) => {
                if (err) throw err;
                
                const key = 'review-' + req.params.cid
                redisClient.setex(key, 3600, JSON.stringify(result.rows));
                return res.status(200).send(result.rows)
            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });

    app.put('/api/reviews/:rid', verifyToken, async (req, res) => {
        try {
            const { error } = valideReviewUpdate(req.body)
            if (error){
                return res.status(404).send(error.details[0].message);
            }
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            client.query('update reviews set review=$1, score=$2, date=$3 where rid=$4',[req.body.review, req.body.score, date, req.params.rid], (err, result) => {
                if (err) throw err;
                return res.status(200).send(result.rows)
            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });
    app.post('/api/reviews/', async (req, res) => {
        try {
            const { error } = valideReviewPost(req.body);
            if (error) {
                return res.status(404).send(error.details[0].message);
            }
            console.log(req.body)
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            client.query('insert into reviews(review, score, owner_id, date) values($1, $2, $3, $4) RETURNING *',
                [req.body.review, req.body.score, req.body.owner_id, date], (err, result) => {
                    if (err) throw err;
                    client.query('insert into user_reviews(uid, rid) values($1, $2)', [req.userId, result.rows[0].rid], (e, data) => {
                        if (e) throw e;
                        return res.status(200).send(result);
                    });

            });
        } catch (error) {
            console.log(error)
            res.status(500).send(error);
        }
    });
    app.delete('/api/reviews/:rid', verifyToken, async (req, res) => {
        try {
            let rid = parseInt(req.params.rid);
            client.query('select * from reviews where rid=$1', [cid], (error, results) => {
                if (error) 
                    throw error;
                if (results.rowCount === 0) {
                    res.status(400).send("Invalid id");
                    return;
                }
                if (results.rows[0].owner_id == req.userId) {
                        client.query('dete from user_reviews where rid=$1', [rid], (errors, data) => {
                            if (errors) throw errors;
                        client.query(`delete from reviews where rid=$1`, [rid], (e, r) => {
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
}