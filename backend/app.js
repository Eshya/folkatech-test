require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const db = require('./configs/db.conf');

const compression = require('compression');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const staticFile = 'public';
const passport = require('passport');