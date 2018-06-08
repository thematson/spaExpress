var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth0 = require('auth0-js');
var bodyParser = require('body-parser');

var bookingRouter = require('./routes/booking-api');
var usersRouter = require('./routes/users');

var dbb = require('./db');

var db = require("./models");
// app.js

const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

var PORT = 3000;

passport.use(new LocalStrategy(
  function (username, password, done) {
    dbb.users.findByUsername(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (user.password != password) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));


// passport.use(new Strategy(
//   function (username, password, cb) {
//     db.users.findByUsername(username, function (err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));
//Auht0 code.....
// const Auth0Strategy = require('passport-auth0');

// // Configure Passport to use Auth0
// const strategy = new Auth0Strategy(
//   {
//     domain: 'thematson.auth0.com',
//     clientID: 'RLanPveBNAdBgAA4WL7NB49FeWRXckfF',
//     clientSecret: 'YOUR_CLIENT_SECRET',
//     callbackURL: 'http://localhost:3000/callback'
//   },
//   (accessToken, refreshToken, extraParams, profile, done) => {
//     return done(null, profile);
//   }
// );

// passport.use(strategy);

// // This can be used to keep a smaller payload
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// // ...
// app.use(passport.initialize());
// app.use(passport.session());
// END Auth0 Code..........................


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  dbb.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.


app.get('/login',
  function (req, res) {
    let name ="this is it";
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('admin');
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });

app.get('/admin',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('admin');
  });




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', bookingRouter);
app.use('/users', usersRouter);

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App now listening on port:", PORT);
  });
});

module.exports = app;
