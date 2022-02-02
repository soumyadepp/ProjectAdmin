const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares');

bodyParser.json();
bodyParser.urlencoded({ extended: false });
//use middleware here
router.use(middlewares);

//post request to create a new follower
router.post('/followlog', async(req, res) => {
    const session = req.session;
    const flid = uuidv4();
    if (session.userid) {
        try {
            const nid = uuidv4();
            const { username, following, followingname } = req.body;
            const checkres = await pool.query('SELECT * FROM followlog WHERE followerid = $1 AND followingid = $2', [username, following]);

            if (checkres.rows.length == 0) {
                await pool.query('INSERT INTO notifications (nid,body,intendeduser,actionuser,notiftime) values($1,$2,$3,$4,NOW())', [nid, `${req.session.userid} started following you.`, followingname, req.session.userid]);
                const response = await pool.query('INSERT INTO followlog (flid,followerid,followingid,followername,followingname,followdate) VALUES ($1,$2,$3,$4,$5,NOW())', [flid, username, following, req.session.userid, followingname]).
                then(() => {

                    res.redirect('back');
                });
            } else {
                res.redirect('back');
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/unauth');
    }
});

//get request to show all followers of a user
router.get('/followlog', async(req, res) => {
    if (req.session.userid) {
        try {
            const response = await pool.query('SELECT * FROM followlog');
            res.send(response.rows);
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/unauth');
    }
});

router.get('/follows/users/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM followlog WHERE followername = $1', [req.params.id]);
            res.send(response.rows);
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/unauth');
    }
});

router.get('/follow/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT followingid FROM followlog WHERE followerid = $1', [req.params.id]);
            res.send(response.rows);
        } catch (err) {
            console.log(err);
        }
    }
});

//delete request to remove a follower
router.post('/followlog/delete/:id', async(req, res) => {
    if (req.session.userid) {
        try {
            console.log(req.params.id);
            const { followingname } = req.body;
            console.log(followingname);
            const response = await pool.query('DELETE FROM followlog WHERE followingid = $1 and followername = $2', [req.params.id, req.session.userid]);
            await pool.query(`DELETE FROM notifications WHERE intendeduser = $1 and actionuser = $2 and body like '%started%'`, [followingname, req.session.userid])
                .then(() => {
                    console.log('deleted notification');
                });
            res.redirect('back');
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/unauth');
    }
});

module.exports = router;