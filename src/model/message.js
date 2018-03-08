const mongoose = require('mongoose');

const message = new mongoose.Schema({
  username: 'string',
  message: 'string'
});

module.exports = mongoose.model('Message', message);