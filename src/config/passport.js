'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserSchema = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  UserSchema.findOne({ email })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect User or Password' });
      } else {
        user.matchPassword(password)
          .then(match => {
            if (match) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect User or Password' });
            }
          });
      }
    })
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserSchema.findById(id, done);
});
