const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares.js');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(middlewares);

router.post('/houses', async(req, res) => {
    try {
        const houseId = uuidv4();
        const { houseLocationX, houseLocationY, houseAddress } = req.body;
        const response = await pool.query("INSERT INTO houses (hid,geolocation,address) values ($1, point($2,$3), $4)", [houseId, houseLocationX, houseLocationY, houseAddress])
            .then(() => {
                res.send('House created');
            });
    } catch (error) {
        console.log(error);
    }
});

router.get('/houses', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM houses');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

router.get('/houses/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM houses WHERE hid = $1', [req.params.id]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

module.exports = router;