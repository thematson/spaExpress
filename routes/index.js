var express = require('express');
var router = express.Router();

const passport = require('passport');

const env = {
  AUTH0_CLIENT_ID: 'RLanPveBNAdBgAA4WL7NB49FeWRXckfF',
  AUTH0_DOMAIN: 'thematson.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

var db = require("../models");

const bookings = require('../data/booking');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'K&W PetSpa' });
});

// Perform the login
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid'
  }),
  function (req, res) {
    res.redirect('/');
  }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/'
  }),
  function (req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

router.get('/api/booking', (req, res) => {

  //db.query(`INSERT INTO appointments VALUES () `)
});

router.post('/api/booking', (req, res) =>{
  let booking = (req.body);
  console.log('the server data is ' + JSON.stringify(booking));
      db.Booking.create({
          firstName: booking.firstName,
          lastName: booking.lastName,
          street: booking.street,
          city: booking.city,
          state: booking.state,
          zip: booking.zip,
          telephone: booking.telephone,
          email: booking.email,
          petName: booking.petName,
          breed: booking.breed,
          service: booking.service,
          date: booking.date,
          time: booking.time
        })
        .then(function (dbPost) {
          res.json(dbPost);
        });
  // friends.push(data);
});

//General Query returns (Errors, Result, Fields)
router.get('/querydb', (req, res) => {
  db.query('SELECT * FROM employees', (error, results, fields) => {
    if (error) {
      throw error;
    }
    console.log(results[0]);
    res.send('database Queried...')
  });
});


module.exports = router;
