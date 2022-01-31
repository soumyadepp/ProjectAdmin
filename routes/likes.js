const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');

//require middleware
const middlewares = require('../middleware/middlewares.js');

//show all likes
router.get('/posts/likes', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM likes');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
})

router.post('/posts/likes/mylike', async(req, res) => {
        const session = req.session;
        const original = req.originalUrl;
        const id = uuidv4();
        if (session.userid) {
            try {
                const responseUser = await pool.query('SELECT username from codereviews where crid = $1', [req.body.postid]);
                const usernameIntended = responseUser.rows[0].username;
                const resp = await pool.query('SELECT * FROM likes WHERE postid = $1 AND username = $2', [req.body.postid, session.userid]);
                if (resp.rows.length === 0) {
                    const response = await pool.query('INSERT INTO likes (lid,username,postid) VALUES ($1,$2,$3)', [id, session.userid, req.body.postid]).then(() => {
                        console.log('success');
                        res.redirect('back');
                    }).catch(error => {
                        console.log(error);
                    });
                    if (usernameIntended != session.userid) {
                        const responseNotif = await pool.query('INSERT INTO notifications(nid,body,intendeduser,postid,actionuser,notiftime) values($1,$2,$3,$4,$5,NOW())', [id, `${session.userid} liked your post.`, usernameIntended, req.body.postid, session.userid])
                            .then(() => {
                                console.log('notification sent');
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                } else {
                    const resp = await pool.query('DELETE FROM likes WHERE postid = $1 AND username = $2', [req.body.postid, session.userid]).then(() => {
                        res.redirect('back');
                    }).catch(error => {
                        console.log(error);
                    });
                    const resp1 = await pool.query('DELETE from notifications where postid = $1 AND actionuser = $2', [req.body.postid, session.userid])
                        .then(() => {
                            console.log('Notification removed');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            res.redirect('/unauth');
        }
    })
    //post request to create a new like
router.post('/posts/likes', async(req, res) => {
    const session = req.session;
    const original = req.originalUrl;
    const id = uuidv4();
    if (session.userid) {
        try {
            const responseUser = await pool.query('SELECT username from codereviews where crid = $1', [req.body.postid]);
            const usernameIntended = responseUser.rows[0].username;
            const resp = await pool.query('SELECT * FROM likes WHERE postid = $1 AND username = $2', [req.body.postid, session.userid]);
            if (resp.rows.length === 0) {
                const response = await pool.query('INSERT INTO likes (lid,username,postid) VALUES ($1,$2,$3)', [id, session.userid, req.body.postid]).then(() => {
                    console.log('success');
                    res.redirect('/dashboard');
                }).catch(error => {
                    console.log(error);
                });
                if (usernameIntended != session.userid) {
                    const responseNotif = await pool.query('INSERT INTO notifications(nid,body,intendeduser,postid,actionuser) values($1,$2,$3,$4,$5)', [id, `${session.userid} liked your post.`, usernameIntended, req.body.postid, session.userid])
                        .then(() => {
                            console.log('notification sent');
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else {
                const resp = await pool.query('DELETE FROM likes WHERE postid = $1 AND username = $2', [req.body.postid, session.userid]).then(() => {
                    res.redirect('/dashboard');
                }).catch(error => {
                    console.log(error);
                });
                const resp1 = await pool.query('DELETE from notifications where postid = $1 AND actionuser = $2', [req.body.postid, session.userid])
                    .then(() => {
                        console.log('Notification removed');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});
//get all users who have liked a post
router.get('/posts/likes/:postid/users', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT username FROM likes WHERE postid = $1', [req.params.postid]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});
//get number of likes for each post using inner join
router.get('/likesmap', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('select crid,count(likes.postid) from codereviews inner join likes on likes.postid = codereviews.crid group by crid;');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
})

//get all likes by a particular user
router.get('/likes/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM likes WHERE username = $1', [req.params.id]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

module.exports = router;