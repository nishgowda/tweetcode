/*
    @file: api.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: Our REST API file. Allowing for GET, PUT, POST and DELTE requests that our
    front end can make requests in via ajax. Connects to our db to store user information.
    Passes in the obtained auth middleware via passport to secure API. 
*/
const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(express.static('views'));
require('./auth-passport.js');
var conn = require('../db')
require('./routes')(app);
// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(400).send("Unauthorized");
    }
}
module.exports = function(app){
    // GET ALL 
    app.get('/api/tweets', isLoggedIn, (req, res) => {
        conn.query('select code_tweet.*, user.username, user.imageUrl from user inner join code_tweet on (code_tweet.uid = user.uid) order by STR_TO_DATE(date, "%d-%m-%Y") desc', function(error, results, fields){
            if (error) throw error;
            results[0].currentUserImg = req.user[0].imageUrl;
            results[0].currentUid = req.user[0].uid;
            results[0].currentUser = req.user[0].username;
            res.send(results);
        });
    });

    // GET ONE
    app.get('/api/tweets/:cid', isLoggedIn, (req, res) =>{
        cid = parseInt(req.params.cid);
        conn.query(`select * from code_tweet where cid=${conn.escape(cid)}`, function(error, results, fields){
            if (error) throw error;
            if (!results.length){
                res.status(400).send("Invalid id");
                return;
            }
            results[0].username = req.user[0].username;  
            res.send(results);
        });    
    });

    // CREATE ONE
    app.post('/api/create', isLoggedIn, (req, res) => {
        console.log(req.user[0].uid);
        const { error } = validatePost(req.body);
        if (error) {
            res.status(404).send(error.details[0].message);
            return;
        }
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(date);
        conn.query(`insert into code_tweet(code, uid, language, title, date) values(${conn.escape(req.body.code)}, ${conn.escape(req.user[0].uid)},${conn.escape(req.body.language)}, ${conn.escape(req.body.title)}, ${conn.escape(date)})`,function(error, results, fields){
            if (error) throw error;
            res.send(results);
        });
    });
    // UPDATE ONE
    app.put('/api/tweets/:cid',isLoggedIn,  (req, res) =>{
        const { error } = validateUpdate(req.body);
        if (error){
            res.status(404).send(error.details[0].message);
            return;
        }
        let cid = parseInt(req.params.cid);
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        conn.query(`update code_tweet set code=${conn.escape(req.body.code)}, language=${conn.escape(req.body.language)}, title=${conn.escape(req.body.title)}, date=${conn.escape(date)} where cid=${cid}`, function(error, results, fields){
            if (error) throw error;
            if(results.affectedRows == 0) {
                res.status(400).send("Invalid id");
                return;
            }
            conn.query(`select * from code_tweet where cid=${conn.escape(cid)}`, function(error, results, fields){
                if (error) throw error;
                res.send(results);
            })
        })
    });
    // DELETE ONE
    app.delete('/api/tweets/:cid', isLoggedIn, (req, res) =>{
        cid = parseInt(req.params.cid);
        conn.query(`select * from code_tweet where cid=${conn.escape(cid)}`, function(e ,r, f){
            if (e) throw e;
            if(r.affectedRows == 0) {
                res.status(400).send("Invalid id");
                return;
            }
            if (r[0].uid == req.user[0].uid){
                conn.query(`delete from code_tweet where cid=${conn.escape(cid)}`, function(error, results, fields){
                    if (error) throw error;
                    if(results.affectedRows == 0) {
                        res.status(400).send("Invalid id");
                        return;
                    }
                    res.send(results);
                });
            }else{
                res.status(400).send("Unauthorized");
                return;
            }
        });
    })
}
// POST and PUT schema that must be met, else we alert the user of the error and prevent
// them from saving any data.
function validatePost(codeTweet){
    const schema = Joi.object({
        code: Joi.string().min(3).required(),
        language: Joi.string().min(1).required(),
        title: Joi.string().min(3).required()
    })
    return result = schema.validate(codeTweet);
}
function validateUpdate(codeTweet){
    const schema = Joi.object({
        cid: Joi.number().min(1).required(),
        code: Joi.string().min(3).required(),
        language: Joi.string().min(1).required(),
        title: Joi.string().min(3).required()
    })
    return result = schema.validate(codeTweet);
}
