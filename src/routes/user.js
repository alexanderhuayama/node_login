'use strict';

const express = require('express');
const router = express.Router();
const UserSchema = require('../models/user');
const passport = require('passport');

router.get('/users/signin', (req, res, next) => {
  res.render('users/signin');
});

router.get('/users/signup', (req, res, next) => {
  res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.post('/users/signup', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name.length) {
    errors.push({ text: 'Please insert your name' })
  }

  if (password !== confirmPassword) {
    errors.push({ text: 'Password do not match' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Password must be at 4 characters' });
  }

  if (errors.length) {
    return res.render('users/signup', { errors, name, email, password, confirmPassword });
  }

  const newUser = new UserSchema({ name, email, password });

  UserSchema.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('errorMsg', 'The email is already in use');
        return res.redirect('/users/signup');
      }

      return newUser.encryptPassword(password)
        .then(password => {
          newUser.password = password;
          return newUser.save();
        })
        .then(() => {
          req.flash('successMsg', 'You are registered');
          res.redirect('/users/signin');
        });
    })
});

router.get('/users/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

module.exports = router;
