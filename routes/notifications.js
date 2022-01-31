const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');

//require middleware
const middlewares = require('../middleware/middlewares.js');

//get all notifications if a user
router.get('/users/notifications', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        const resp = await pool.query('SELECT * from notifications where intendeduser = $1 order by notiftime asc', [session.userid]);
        res.send(resp.rows);
    } else {
        res.redirect('/unauth');
    }
});

module.exports = router;