/*
    @file: routes.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: Routing file that redirects to our static html, css and client side js files.
    Also initializes passport and sessison.
*/
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('views'));
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./auth-passport.js');

module.exports = function(app){
    app.use(cookieSession({
        name: 'tweetcode-session',
        keys: ['key1', 'key2']
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/tweets', (req, res) =>{
        res.sendFile('tweets.html', {root: "views/"});
    });
    app.get('/', (req, res) =>{
        res.sendFile('login.html', {root: "views/"});
    });
    app.get('/create', (req, res) => {
        res.sendFile('create.html', {root: "views/"});
    });
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureMessage: 'Failed to log in' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/tweets');
    }
    );
    app.get('/auth/github/', passport.authenticate('github', { scope: ['user:email'] }));
    app.get('/auth/github/callback', passport.authenticate('github', { failureMessage: 'Failed to log in' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/tweets');
    }
    );
    
    app.get('/showtweet/:cid', (req, res) =>{
        res.sendFile('showtweet.html', {root:"views/"})
    })
    app.get('/delete/:cid', (req, res) => {
        res.sendFile('delete.html', {root: "views/"});
    });
    app.get('/logout', (req, res) => {
        req.session = null;
        req.logout();
        res.redirect('/');
    })
};