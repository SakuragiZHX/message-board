const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: 'string',
  password: 'string'
});

module.exports = mongoose.model('User', user);