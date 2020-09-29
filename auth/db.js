const  {Client} = require('pg')
const { __prod__ } = require('./constants')
require('dotenv').config();

const client = new Client({
    connectionString: __prod__? process.env.DATABASE_URL : 'postgres://nishgowda:2douglas@localhost:5432/tweetcode'
});
client.connect();

module.exports = client;