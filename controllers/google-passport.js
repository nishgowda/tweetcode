/*
  @file:google-passport.js
  @author:Nish Gowda
  @date:08/03/20
  @about: Auth Middlware using google oauth and passport.js to create a token
  for a user when they login via Google and store in db. If the user is already entered
  in the database then we grab their account, else we create an account for them.
*/
const passport = require('passport');
const mysql = require('mysql');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var conn = require('../db')
require('dotenv').config()

passport.serializeUser(function(user, done) {
    done(null, user.uid);
   });
   
 passport.deserializeUser(function(user, done) {
    conn.query(`select * from user where uid =${user}`,function(err,result){	
         if (err) throw err;
         done(null, result);
     });
 });
 
 passport.use(new GoogleStrategy({
     clientID: process.env.CLIENT_ID,
     clientSecret: process.env.CLIENT_SECRET,
     callbackURL: process.env.CALLBACK_URL
   },
   function(accessToken, refreshToken, profile, done) {
    conn.query(`select * from user where email='${conn.escape(profile.emails[0].value)}'`, function(error, results){
         if (error) throw error;
         // if the user exists in database then grab their account
         if (results.length > 0){
            conn.query(`select * from user where uid=${conn.escape(results[0].uid)}`, function(err, result, f){
             return done(null, result[0]);
             });
          // if the user is not in database, then we create an account, store their info
          // and grab their new account.
         }else{
            conn.query(`insert into user(username, email, imageUrl) values('${conn.escape(profile.displayName)}', '${conn.escape(profile.emails[0].value)}', '${profile._json['picture']}')`, function(err, data, field){
                 if (err) throw err;
                 conn.query(`select * from user where email='${conn.escape(profile.emails[0].value)}'`, function(e, r, f){
                    if (e) throw e;
                    return done(null, r[0])
                 });
             });
         }
     })
   }
 ));
 