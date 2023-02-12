require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./configs/db.conf');
db.connect();

const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const staticFile = 'public';
const passport = require('passport');

var app = express();

app.use(logger('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(cookieParser());
app.use(
    session({
        secret: 'jasoid98qy93r8yq3hhashd0909has',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 1000 * 60 * 60 * 6},
        store: new MongoStore({mongooseConnection: db.connection}),
    })
);
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(require('./routes'));
app.use(express.static(path.join(__dirname, staticFile)));

app.all('/*', (req, res, next) => {
    res.sendFile('index.html', {root: staticFile});
});
app.use(function (err, req, res, next) {
    if (err.status === 401) {
      res.status(401).send({error:'Wrong Password'});
    } else {
      next(err);
    }
});

module.exports = app;
