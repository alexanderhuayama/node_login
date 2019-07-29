'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.encryptPassword = password => {
  return bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt));
};

UserSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
