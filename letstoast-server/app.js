require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

// CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:
const cors = require('cors');

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(express.static(path.join(__dirname, 'public')));

// default value for title local
app.locals.title = 'LetsToast';

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

// Enable authentication using session + passport
app.use(session({
  secret: 'LetsToast secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(flash());
require('./passport')(app);

// ROUTES MIDDLEWARE STARTS HERE:
const index = require('./routes/index');
const auth = require('./routes/auth');
const user = require('./routes/user');

app.use('/', index);
app.use('/', auth);
app.use('/', user);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
