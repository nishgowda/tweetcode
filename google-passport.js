const passport = require('passport');
const mysql = require('mysql');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var conn = require('./db')
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
    conn.query(`select * from user where email='${profile.emails[0].value}'`, function(error, results){
         if (error) throw error;
         if (results.length > 0){
            conn.query(`select * from user where uid=${results[0].uid}`, function(err, result, f){
             return done(null, result[0]);
             });
         }else{
            conn.query(`insert into user(username, email, imageUrl) values('${profile.displayName}', '${profile.emails[0].value}', '${profile._json['picture']}')`, function(err, data, field){
                 if (err) throw err;
                 conn.query(`select * from user where email='${profile.emails[0].value}'`, function(e, r, f){
                    if (e) throw e;
                    return done(null, r[0])
                 });
             });
         }
     })
   }
 ));
 