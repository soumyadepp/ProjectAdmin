const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(middlewares);

router.get('/activity/:userid', async(req, res) => {
    if (req.session.userid) {
        try {
            const response = await pool.query('SELECT username,reviewdate,count(crid) FROM codereviews WHERE username = $1 group by username,reviewdate', [req.params.userid]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

module.exports = router;