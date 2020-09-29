/*
    @file: db.js
    @author: Nish Gowda
    @about: db file that connects to Postgress and creates a connection.
    Exports the connection so that our API and middleware can connect to it.
*/
const {Client} = require('pg')
require('dotenv').config()

const client = new Client({
    connectionString: __prod__? process.env.DATABASE_URL : 'postgres://nishgowda:2douglas@localhost:5432/tweetcode'

});

client.connect();

module.exports = client;
