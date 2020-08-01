const express = require('express');
const Joi = require('joi');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session')
app.use(express.json());
app.use(express.static('public'));
require('./google-passport.js');
var conn = require('./db')


app.use(cookieSession({
    name: 'tweetcode-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/tweets', (req, res) =>{
    res.sendFile('tweets.html', {root: "public/"});
});
app.get('/', (req, res) =>{
    res.sendFile('login.html', {root: "public/"});
});
app.get('/failed', (req, res) => res.send('Failed to log in'))
app.get('/create', (req, res) => {
    res.sendFile('create.html', {root: "public/"})
});
app.get('/auth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/tweets');
  }
);
app.get('/showtweet/:cid', (req, res) => {
    res.sendFile('showtweet.html', {root: "public/"})
});
app.get('/delete/:cid', (req, res) => {
    res.sendFile('delete.html', {root: "public/"})
});
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


// <------ api ------>
// print all the tweets
app.get('/api/tweets',isLoggedIn,  (req, res) => {
    conn.query('select code_tweet.*, (select username from user where uid = code_tweet.uid) as username from code_tweet', function(error, results, fields){
        if (error) throw error;
        console.log(results);
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
    conn.query(`insert into code_tweet(code, uid, language) values("${req.body.code}", ${req.user[0].uid}, "${req.body.language}")`,function(error, results, fields){
        if (error) throw error;
        res.send(results);
    });
});
// update a specific tweet
app.put('/api/tweets/:cid',isLoggedIn, (req, res) =>{
    const { error } = validateUpdate(req.body);
    if (error){
        res.status(404).send(error.details[0].message);
        return;
    }
    cid = parseInt(req.params.cid);
    conn.query(`update code_tweet set code="${req.body.code}", language="${req.body.language}" where cid=${cid}`, function(error, results, fields){
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
        language: Joi.string().min(1).required()
    })
    return result = schema.validate(codeTweet);
}
function validateUpdate(codeTweet){
    const schema = Joi.object({
        cid: Joi.number().min(1).required(),
        code: Joi.string().min(3).required(),
        language: Joi.string().min(1).required()
    })
    return result = schema.validate(codeTweet);
}

app.listen(process.env.PORT, () => console.log(`Server hosted at http://locahost:${process.env.PORT}`));