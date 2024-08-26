const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const router  = require('./routes');
const exphbs  = require('express-handlebars');
const path    = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser')

require('dotenv').config({path: '.env'})


const app = express();
//! Habilitar bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//! Habilitar handlebars como view
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars'),
    })
);
app.set('view engine', 'handlebars');

//! static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}));


app.use('/', router());

app.listen(process.env.PUERTO);