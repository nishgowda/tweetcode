/*
    @file: db.js
    @author: Nish Gowda
    @data: 08/03/20
    @about: db file that connects to MySQL and creates a connection.
    Exports the connection so that our API and middleware can connect to it.
*/
const mysql = require('mysql');
require('dotenv').config()
const conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: process.env.PASSWORD,
    database : process.env.DATABASE
});

// establish mysql connection
conn.connect(function(err){
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected to mysql db');
    });

 module.exports = conn;
