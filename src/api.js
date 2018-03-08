const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const User = require('./model/user');
const Message = require('./model/message');

const DB_ADDRESS = 'mongodb://localhost/message-board';
const router = express.Router();

mongoose.connect(DB_ADDRESS);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Connection DB ERROR:', err);
});

router.post('/signin', (req, res, next) => {
  const { username, password } = req.body;
  const hash = crypto.createHash('md5');

  if (username && password) {
    User.findOne({ username } ,(err, user) => {
      if (err) {
        next(err);
      }

      hash.update(password);
      const newPass = hash.digest('hex');

      console.log(user);
      console.log(newPass);

      if (!user || user.password !== newPass) {
        res.status(200).json({
          message: '用户名或密码错误'
        });

        return;
      }

      res.sendStatus(200);
    });
  }
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      next(err);
    }

    if (!user) {
      const hash = crypto.createHash('md5');
      hash.update(password);
    
      const user = new User({
        username,
        password: hash.digest('hex')
      });
    
      user.save((err) => {
        err && next(err);
    
        res.sendStatus(200);
      });
    } else {
      res.status(200).json({
        message: '用户名已被使用'
      });
    }
  });
});

router.use((err, req, res, next) => {
  console.error(`DB ERROR: ${err.stack}`);
  res.sendStatus(500);
});


module.exports = router;