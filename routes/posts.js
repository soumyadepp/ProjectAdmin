//all imports here
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares.js');
const methodOverride = require('method-override');

//router use
router.use(middlewares);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride('_method'));
//get method to get all posts
router.get('/posts', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM codereviews order by reviewdate desc');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//post method to create a new post
router.post('/posts', async(req, res) => {
    try {
        const userid = req.session.userid;
        const id = uuidv4();
        const { date, title, task } = req.body;
        const newPost = await pool.query('INSERT INTO codereviews (crid,username,reviewdate,title,description) VALUES ($1, $2,$3,$4,$5)', [id, userid, date, title, task])
            .then(() => {
                console.log('posted successfully');
                res.redirect('/dashboard');
            })
            .catch(error => {
                console.log(error);
            });;
    } catch (error) {
        console.log(error);
    }
});


router.get('/posts/:uname', async(req, res) => {
    try {
        const session = req.session;
        if (session.userid) {
            const response = await pool.query('SELECT * FROM codereviews WHERE username = $1', [req.params.uname]);
            res.send(response.rows);
        } else {
            res.redirect('/unauth');
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/posts/delete/:id', async(req, res) => {
    try {
        const session = req.session;
        if (session.userid) {
            const response = await pool.query('DELETE FROM codereviews WHERE crid = $1', [req.params.id]);
            console.log('post deleted');
            const notifDelete = await pool.query('DELETE from notifications where postid = $1', [req.params.id]);
            console.log('notifications cleared');
            res.redirect('/dashboard');
        } else {
            res.redirect('/unauth');
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;