const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.static('public'));
require('./google-passport.js');
var conn = require('./db')

require('./routes')(app);
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(400).send("Unauthorized");
    }
}

// Auth middleware that checks if the user is logged in


// <------ api ------>
// print all the tweets
app.get('/api/tweets', isLoggedIn, (req, res) => {
    conn.query('select code_tweet.*, user.username, user.imageUrl from user inner join code_tweet on (code_tweet.uid = user.uid)', function(error, results, fields){
        if (error) throw error;
        results[0].currentUserImg = req.user[0].imageUrl;
        results[0].currentUid = req.user[0].uid;
        res.send(results);
    });
});

// get the specific tweet
app.get('/api/tweets/:cid', isLoggedIn, (req, res) =>{
    cid = parseInt(req.params.cid);
    conn.query(`select * from code_tweet where cid=${cid}`, function(error, results, fields){
        if (error) throw error;
        if (!results.length){
            res.status(400).send("Invalid id");
            return;
        }  
        res.send(results);
    });    
});

// create a code tweet
app.post('/api/create', isLoggedIn, (req, res) => {
    console.log(req.user[0].uid);
    const { error } = validatePost(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }
    conn.query(`insert into code_tweet(code, uid, language, title) values("${req.body.code}", ${req.user[0].uid}, "${req.body.language}", "${req.body.title}")`,function(error, results, fields){
        if (error) throw error;
        res.send(results);
    });
});
// update a specific tweet
app.put('/api/tweets/:cid',isLoggedIn,  (req, res) =>{
    const { error } = validateUpdate(req.body);
    if (error){
        res.status(404).send(error.details[0].message);
        return;
    }
    cid = parseInt(req.params.cid);
    conn.query(`update code_tweet set code="${req.body.code}", language="${req.body.language}", title="${req.body.title}" where cid=${cid}`, function(error, results, fields){
        if (error) throw error;
        if(results.affectedRows == 0) {
            res.status(400).send("Invalid id");
            return;
        }
        conn.query(`select * from code_tweet where cid=${cid}`, function(error, results, fields){
            if (error) throw error;
            res.send(results);
        })
    })
});
// delete tweet with given id
app.delete('/api/tweets/:cid', isLoggedIn, (req, res) =>{
    cid = parseInt(req.params.cid);
    conn.query(`delete from code_tweet where cid=${cid}`, function(error, results, fields){
        if (error) throw error;
        if(results.affectedRows == 0) {
            res.status(400).send("Invalid id");
            return;
        }
        res.send(results);
    })
})

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
let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server hosted at http://locahost:${port}`));