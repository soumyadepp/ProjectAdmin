const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
//require middleware
const middlewares = require('../middleware/middlewares.js');
const { isRequired } = require('nodemon/lib/utils');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//use middleware here
router.use(middlewares);

//get request to get all users
router.get('/users', async(req, res) => {
    if (req.session.userid) {
        try {
            const response = await pool.query('SELECT uid,username,email FROM users');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//get request to get user by id
router.get('/users/api/:uname', async(req, res) => {
    if (req.session.userid) {
        try {
            const response = await pool.query('SELECT uid,username,email FROM users WHERE username = $1', [req.params.uname]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//login function
router.post('/users/login', async(req, res) => {
    try {
        const session = req.session;
        const { email, password } = req.body;
        const response = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (response.rows.length > 0) {
            session.userid = response.rows[0].username;
            session.email = response.rows[0].email;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: "Invalid Credentials" });
        }
    } catch (error) {
        console.log(error);
    }
})

//post request to create a new user
router.post('/users/register', async(req, res) => {
    try {
        const id = uuidv4();
        const { email, username, password } = req.body;
        const response = await pool.query("INSERT INTO users (uid,username,email,password) values ($1,$2,$3,$4)", [id, username, email, password])
            .then(() => {
                res.redirect('/login');
            }).catch(error => {
                res.render('register', { error: 'Email or username already exists' });
                console.log(error);
            })
    } catch (error) {
        res.redirect('/register', { error: 'Cannot register' });
        console.log(error);
    }
})

//export the router
module.exports = router;