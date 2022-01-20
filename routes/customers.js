//import dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pool = require('../database/db.js');
const { v4: uuidv4 } = require('uuid');
const middlewares = require('../middleware/middlewares.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
//use middleware here
router.use(middlewares);

//post request to create a new customer
router.post('/customers', async(req, res) => {
    try {
        //create a new customer id
        const id = uuidv4();
        //get the customer information from the request body
        const { customerFirstName, customerLastName, email, phoneNumber } = req.body;
        const response = await pool.query('INSERT INTO customers (cid,firstname,lastname,email,phonenumber) VALUES ($1,$2,$3,$4,$5)', [id, customerFirstName, customerLastName, email, phoneNumber])
            .then(() => {
                res.send('Customer Created');
            });
    } catch (error) {
        //if there is an error, log it to the console
        console.log(error);
    }
});

//get request to get all customers
router.get('/customers', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM customers');
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//get request to get a customer by id
router.get('/customers/:id', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        try {
            const response = await pool.query('SELECT * FROM customers WHERE cid = $1', [req.params.id]);
            res.send(response.rows);
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/unauth');
    }
});

//export the router
module.exports = router;