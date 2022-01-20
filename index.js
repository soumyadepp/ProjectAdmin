//import dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config('./.env');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const pool = require('./database/db.js');

//import middleware
const middlewares = require('./middleware/middlewares');
//import all routes
const userRoutes = require('./routes/users.js');
const customerRoutes = require('./routes/customers.js');
const houseRoutes = require('./routes/houses.js');
const roomRoutes = require('./routes/rooms.js');
const postRoutes = require('./routes/posts.js');
const likeRoutes = require('./routes/likes.js');
const notificationRoutes = require('./routes/notifications.js');

//use a body parser to get beautified output
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use(middlewares);
//routes for houses
app.use(houseRoutes);
//routes for rooms
app.use(roomRoutes);
//routes for users
app.use(userRoutes);
//routes for customers
app.use(customerRoutes);
//routes for posts
app.use(postRoutes);
//all page routes
app.use(likeRoutes);
//likes routes
app.use(notificationRoutes);
//notif routes

app.get('/', (req, res) => {
    res.render('index', { user: req.session.userid });
});
app.get('/register', (req, res) => {
    res.render('register', { error: "" });
});
app.get('/login', (req, res) => {
    if (req.session.userid) {
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: "" });
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userid) {
        res.redirect('/login');
    } else {
        res.render('dashboard', { user: req.session.userid, email: req.session.email });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.get('/contribute', (req, res) => {
    res.render('contribute');
});

app.get('/notifs', async(req, res) => {
    const session = req.session;
    if (session.userid) {
        await pool.query('UPDATE notifications SET isseen = true WHERE intendeduser = $1', [req.session.userid]);
        res.render('notifications');
    } else {
        res.redirect('/unauth');
    }
})

app.get('/unauth', (req, res) => {
    res.render('unauthenticated');
})

app.get('/users/:id', (req, res) => {
    try {
        if (req.session.userid)
            res.render('userhome', { user: req.params.id == req.session.userid ? "My profile" : req.params.id, username: req.params.id, sessionUser: req.session.userid });
        else {
            res.redirect('/unauth');
        }
    } catch (error) {
        console.log(error);
    }
});
//page routes end

//listen to port
app.listen(process.env.PORT, () => {
    console.log('Server started on port ' + process.env.PORT);
});