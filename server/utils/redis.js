const redis = require("redis");
require('dotenv').config()

// configure redis client on port 6379
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

module.exports = redisClient;
