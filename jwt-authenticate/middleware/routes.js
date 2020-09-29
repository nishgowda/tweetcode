const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const cors = require('cors')
const corsOption = {
    credentials: true,
    origin: true,
}
app.use(cors(corsOption));
app.set("trust proxy", 1)
const passport = require('passport');
const client = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
require('../config/pass');
const {__prod__ } = require('../constants')
const cookieConfig = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: __prod__ ? true: false,
    domain: __prod__ ? '.tweetcode.ml' : 'localhost',
    path: '/'
};

module.exports = app => {
    app.use(passport.initialize());

    app.post('/auth/register', async (req, res, next) => {
        passport.authenticate('register', async (err, user, info) => {
            try {
                if (err) {
                    console.log(err);
                }
                if (info !== undefined) {
                    console.log('info', info.message);
                    res.send(info.message);
                } else {
                    req.logIn(user, async (err) => {
                        try {
                            client.query('update users set username=$1 where email=$2', [
                                req.body.username, user.email
                            ], (e, _) => {
                                if (e) {
                                    throw e;
                                }
                                const token = jwt.sign({
                                    id: user.uid
                                }, process.env.JWTSECRET);
                                res.cookie('x-access-token', token, cookieConfig);
                                res.status(200).send('Authorized');
                            });
                        } catch (err) {
                            res.status(400).send(err);
                        }

                    });
                }
            } catch (error) {
                return next(error);
            }


        })(req, res, next);
    });
    app.post('/auth/login', async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    throw err;
                }
                if (info !== undefined) {
                    console.log(info.message);
                    res.send(info.message);
                } else {
                    req.logIn(user, async (e) => {
                        try {
                            const token = jwt.sign({
                                id: user.uid
                            }, process.env.JWTSECRET);
                            res.cookie('x-access-token', token, cookieConfig);
                            res.status(200).send('Authorized');
                        } catch (e) {
                            return next(e);
                        }

                    });
                }
            } catch (error) {
                return next(error);
            }

        })(req, res, next);
    });

    app.post('/auth/forgotpassword', async (req, res) => {
        try {
            client.query('select * from users where email =$1', [req.body.email], (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rowCount < 1) {
                    console.log("Email is not in databse")
                    return;
                } else {
                    const token = jwt.sign({
                        id: results.rows[0].uid
                    }, process.env.JWTSECRET);
                        client.query('update users set password=$1 where email=$2', [token, req.body.email], (error, result) => {
                            if (error) {
                                throw error;
                            }
                            const msg = {
                                to: req.body.email,
                                from: 'support@tweetcode.ml',
                                subject: 'Password Reset Link',
                                text: 'You are recieving this because you have requested the reset of the password for your account. \n\n'
                                + 'Please visit the following link to complete the process: \n\n' + `https://tweetcode.ml/reset/${token}  \n\n`
                                + 'If you did not request this, please ignore this email.'
                              };
                            sgMail.send(msg).then(() => {
                                console.log('Message sent')
                                return res.status(200).send("Recovery email sent");
                            }).catch((error) => {
                                console.log(error)
                                return;
                            })
                        });
                }
            });
        } catch (error) {
            console.log(error);
        }
       
    });

    app.get('/auth/reset/:token', async (req, res) => {
        try {
            client.query('select * from users where password=$1', [req.params.token], (err, result) => {
                if (err) throw err;
                if (result.rowCount < 1) {
                    res.status(400).send('Reset link is invalid')
                } else {
                    res.status(200).send({ email: result.rows[0].email, message: "Valid password link" })
                }
            });
        } catch (error) {
            console.log(error)
        }

    })

    app.put('/auth/updatePassword', async (req, res) => {
        try {
            client.query('select * from users where email=$1', [req.body.email], (err, user) => {
                if (err) throw err;
                if (user.rowCount < 1) {
                    return res.status(404).send("no user")
                } else {
                    bcrypt.hash(req.body.password, 10).then(hashedPassword => {
                        client.query('update users set password=$1 where uid=$2', [hashedPassword, user.rows[0].uid], (error, result) => {
                            if (error) throw error;
                            res.status(200).send("Password Updated")
                        })
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
        
    })
    app.get('/auth/google/', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback', async (req, res, next) => {
        passport.authenticate('google', {
            failureMessage: 'Failed to log in'
        }, async (err, user, info) => {
                try {
                    if (err) {
                        throw err;
                    }
                    console.log(user);
                    if (info === undefined) {
                        console.log(info);
                        res.send(info.message);
                    } else {
                        req.logIn(user, async (e) => {
                            try {
                                const token = jwt.sign({
                                    id: user.uid
                                }, process.env.JWTSECRET);
                                console.log(token);
                                res.cookie('x-access-token', token, cookieConfig);
                                res.redirect( __prod__? 'https://tweetcode.ml/': 'http://localhost/');
                            } catch (e) {
                                return next(e);
                            }
                            
                        });
                    }
                } catch (error) {
                    return next(error)
                }
           
        })(req, res, next);
    });

    app.get('/auth/github/', passport.authenticate('github', {scope: ['user:email']}));
    app.get('/auth/github/callback', async (req, res, next) => {
        passport.authenticate('github', {
            failureMessage: 'Failed to log in'
        }, async (err, user, info) => {
                try {
                    if (err) {
                        throw err;
                    }
                    console.log(user)
                    if (info === undefined) {
                        console.log(info);
                        res.send(info.message);
                    } else {
                        req.logIn(user, async (err) => {
                            try {
                                const token = jwt.sign({
                                    id: user.uid
                                }, process.env.JWTSECRET);
                                console.log(token);
                                res.cookie('x-access-token', token, cookieConfig);
                                res.redirect( __prod__? 'https://tweetcode.ml/': 'http://localhost/');
                            } catch (e) {
                                return next(e);
                            }
                            
                        });
                    }
                } catch (error) {
                    return next(error)
                }
           
        })(req, res, next);

    });

    app.get('/logout', (_, res) => {
        res.cookie("x-access-token", "", {
            expires: new Date(0),
            domain: __prod__? '.tweetcode.ml' : 'localhost',
            path: '/'
        });
        res.redirect( __prod__? 'https://tweetcode.ml/': 'http://localhost/');
    });
};
