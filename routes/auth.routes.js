const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// SIGN UP -------------------------------------------

router.get('/auth/signup', (req, res) => {
   res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
   const { username, password } = req.body;

   if (username === '' || password === '') {
      res.status(400).render('index', {
         errorMessage: 'Indicate a username and a password to sign up',
      });
      return;
   }

   User.findOne({ username })
      .then((user) => {
         if (user !== null) {
            res.status(400).render('index', {
               errorMessage: 'The username already exists',
            });
            return;
         } else {
            bcrypt

               .genSalt(saltRounds)

               .then((salt) => bcrypt.hash(password, salt))

               .then((hashedPassword) => {
                  return User.create({
                     username,

                     password: hashedPassword,
                  });
               })

               .then((user) => {
                  res.render('success');
               })
               .catch((error) => next(error));
         }
      })
      .catch((error) => next(error));
});

module.exports = router;
