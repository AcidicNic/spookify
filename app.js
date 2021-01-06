require('dotenv').config();
const port = process.env.PORT || 80;

const express = require('express');
const hbs = require('express-handlebars');
const expressValidator = require('express-validator');
const path = require('path');

const router = require('./routes/main.js');

const app = express();

const bodyParser = require('body-parser');

const expressSession = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {}
});

if (app.get('env') === 'prod') {
  app.set('trust proxy', 1);
  expressSession.cookie.secure = true;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

app.engine('hbs', hbs({
    extname: '.hbs',
    layoutDir: __dirname + '/views',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: 'base',
    helpers: {}
}));
app.set('view engine', 'hbs');

app.use(express.static(path.normalize(path.join(__dirname, 'public'))));

// pass thisUser to every template to every route
app.use(function(req, res, next) {
    if (req.user) {
        res.locals.thisUser = req.user.name;
    }
    next();
});

// Routes
app.use('/', router);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });

module.exports = app;
