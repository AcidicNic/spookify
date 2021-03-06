require('dotenv').config();

const express = require('express');
const app = express();


// Express Device Setup
app.set('view engine', 'ejs');
var device = require('express-device');
app.use(device.capture());

// Bodyparser Setup
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars setup
const hbs = require('express-handlebars');
app.engine('hbs', hbs({
    extname: '.hbs',
    layoutDir: __dirname + '/views',
    defaultLayout: 'base',
    helpers: {
        // {{#ifEqls true false}} {{/ifEqls}}
        ifEqls: function(arg, arg2, options) {
        return (arg == arg2) ? options.fn(this) : options.inverse(this);
        },
        // {{#ifGreater int int}} {{/ifGreater}}
        ifGreater: function(arg, arg2, options) {
        return (arg > arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'hbs');

// Static setup
const path = require('path');
app.use(express.static(path.normalize(path.join(__dirname, 'public'))));

// Routes
const mainRouter = require('./routes/main.js');
app.use('/', mainRouter);

// Run server
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });

module.exports = app;
