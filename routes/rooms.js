//all imports here
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares.js');

//router use
router.use(middlewares);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//get method to get all the rooms
router.get('/rooms', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM rooms');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//post method to create a new room
router.post('/rooms', async(req, res) => {
    try {
        const id = uuidv4();
        const { roomCapacity, roomDescription } = req.body;
        const newRoom = await pool.query('INSERT INTO rooms (rid,rcapacity,rdescription) VALUES ($1, $2,$3)', [id, roomCapacity, roomDescription]);

    } catch (error) {
        console.log(error);
    }
});

router.get('/rooms/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM rooms');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});


module.exports = router;