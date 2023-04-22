const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// SIGN UP -------------------------------------------

router.get('/auth/signup', (req, res) => {
   res.render('signup');
});

router.post('/auth/signup', (req, res, next) => {
   const { username, password } = req.body;

   if (username === '') {
      res.render('signup', { message: 'Username cannot be empty' });
      return;
   }

   if (password.length < 8) {
      res.render('signup', {
         message: 'Pasword has to be minimum 8 characters',
      });
      return;
   }

   User.findOne({ username }).then((userFromDB) => {
      if (userFromDB !== null) {
         res.render('signup', { message: 'Username is already taken' });
      } else {
         const salt = bcrypt.genSaltSync();
         const hash = bcrypt.hashSync(password, salt);

         User.create({ username, password: hash })
            .then((createdUser) => res.redirect('/auth/login'))
            .catch((err) => next(err));
      }
   });
});

module.exports = router;
