/*
  @file:pass.js
  @author:Nish Gowda
  @date:08/03/20
  @about: Auth Middlware using google oauth and passport.js to create a token
  for a user when they login via Google or GitHub and store in db. If the user is already entered
  in the database then we grab their account, else we create an account for them.
*/
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const client = require('../db')
require('dotenv').config();
passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (user, done) {
    client.query('select * from users where uid =$1', [user.uid], (err, result) => {
        if (err) 
            throw err;
        


        done(null, result.rows[0].uid);
    });
});
passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
},async (username, password, done) => {
        try {
            client.query('select * from users where email=$1', [username], (err, result) => {
                if (err) throw err;
                if (result.rowCount > 0) {
                    return done(null, false, { message: "email already taken" });
                } else {
                    bcrypt.hash(password, 10).then(hashedPassword => {
                        client.query('insert into users(username, email, imageurl, password) values($1, $2, $3, $4) returning *', ['', username, '', hashedPassword], (error, results) => {
                            if (error) throw err;
                            return done(null, results.rows[0]);
                        });
                    });
                }
            });
        } catch (error) {
            return done(error)
        }
            
}))
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (username, password, done) => {
        try {
            client.query('select * from users where email=$1', [username], (err, result) => {
                if (err) throw err;
                if (result.rowCount < 1) {
                    return done(null, false, { message: 'bad email' });
                } else {
                    bcrypt.compare(password, result.rows[0].password).then(response => {
                        if (!response) {
                            return done(null, false, { message: "password does not match" });
                        }
                        return done(null, result.rows[0]);
                    })
                }
            })
        } catch (error) {
            return done(error)
        }
}))

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
}, function (accessToken, refreshToken, profile, done) {
    client.query('select * from users where email=$1', [profile.emails[0].value], (error, results) => {
        if (error) 
            throw error;
        


        // if the user exists in database then grab their account
        if (results.rowCount > 0) {
            client.query('select * from users where uid=$1', [results.rows[0].uid], (err, result) => {
                return done(null, result.rows[0]);
            });
            // if the user is not in database, then we create an account, store their info
            // and grab their new account.
        } else {
            client.query('insert into users(username, email, imageUrl) values($1, $2, $3)', [
                profile.displayName, profile.emails[0].value,
                profile._json['picture']
            ], (err, data) => {
                if (err) 
                    throw err;
                


                return done(null, data.rows[0])

            });
        }
    })
}));
passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_REDIRECT_URI
}, function(accessToken, refreshToken, profile, done) {
    client.query('select * from users where email=$1', [profile._json['email']], (error, results) => {
        if (error) 
            throw error;
        


        // if the user exists in database then grab their account
        if (results.rowCount > 0) {
            client.query('select * from users where uid=$1', [results.rows[0].uid], (err, result) => {
                return done(null, result.rows[0]);
            });
            // if the user is not in database, then we create an account, store their info
            // and grab their new account.
        } else {
            client.query('insert into users(username, email, imageUrl) values($1, $2, $3)', [
                profile.displayName, profile._json['email'], profile._json['avatar_url']
            ], (err, data) => {
                if (err) 
                    throw err;
                


                return done(null, data.rows[0])
            });
        }
    })
}));
