const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// SIGN UP -------------------------------------------

router.get('/signup', (req, res) => {
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

// Login

router.get('/login', (req, res) => {
   res.render('auth/login');
});

router.post('/login', (req, res, next) => {
   const { email, password } = req.body;

   if (email === '' || password === '') {
      res.render('auth/login', {
         errorMessage: 'Please enter both, email and password to login.',
      });
      return;
   }

   User.findOne({ email })
      .then((user) => {
         if (!user) {
            res.render('auth/login', {
               errorMessage: 'Email is not registered. Try with other email.',
            });
            return;
         } else if (bcrypt.compareSync(password, user.password)) {
            res.render('users/user-profile', { user });
         } else {
            res.render('auth/login', { errorMessage: 'Incorrect password.' });
         }
      })
      .catch((error) => next(error));
});

module.exports = router;
