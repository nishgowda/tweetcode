const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors')
const corsOption = {
    credentials: true,
    origin: true
}
app.use(cors(corsOption));
const client = require('../utils/db')
const redis_client = require('../utils/redis')
const {verifyToken} = require('../middleware/jwtVerify')
const { validateSearchQuery } = require('../middleware/validateSchema')
const { checkSearchCache } = require('../middleware/cacheCheck')


module.exports = app => {
    app.get('/api/search/:qid', verifyToken, checkSearchCache, (req, res) => {
        const { error } = validateSearchQuery(req.params.qid)
        if (error) {
            res.status(404).send(error.details[0].message)
            return;
        }
            client.query("select row_to_json(t) from (select *, ( select array_to_json(array_agg(row_to_json(d))) from (select users.* from users inner join users_code_tweets on users_code_tweets.uid=users.uid where users_code_tweets.cid=code_tweets.cid) d ) as collabs from code_tweets where status='public' and document @@ plainto_tsquery($1) order by ts_rank(document, plainto_tsquery($2)) desc ) t"
                , [req.params.qid, req.params.qid], (err, result) => {
                    if (err) throw err;
                    let key = "search-" + req.params.qid
                    redis_client.setex(key, 3600, JSON.stringify(result.rows));
                 res.status(200).send(result.rows);
            });
    });
}