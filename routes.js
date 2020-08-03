const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./google-passport.js');


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(400).send("Unauthorized");
    }
}


module.exports = function(app){
app.use(cookieSession({
    name: 'tweetcode-session',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize());
app.use(passport.session());

app.get('/tweets', (req, res) =>{
    res.sendFile('tweets.html', {root: "public/"});
});
app.get('/', (req, res) =>{
    res.sendFile('login.html', {root: "public/"});
});
app.get('/create', (req, res) => {
    res.sendFile('create.html', {root: "public/"});
});
app.get('/auth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureMessage: 'Failed to log in' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/tweets');
  }
);
app.get('/showtweet/:cid', (req, res) =>{
    res.sendFile('showtweet.html', {root:"public/"})
})
app.get('/delete/:cid', (req, res) => {
    res.sendFile('delete.html', {root: "public/"});
});
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
};