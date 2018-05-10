const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'GET /users'
  });
});

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;
  User.find({ email })
      .exec()
      .then(userArr => {
        if (userArr.length > 0) {
          return res.status(409).json({
            message: 'Email is already in use.'
          });
        }
      });
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      return res.status(500).json({ error });
    } else {
      const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        username,
        email,
        password: hash
      });
      newUser.save()
             .then(result => {
               res.status(201).json({
                 message: 'New user created.',
                 result
               });
             })
             .catch(error => {
               res.status(500).json({ error });
             });
    }
  });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
      .then(result => {
        res.status(200).json({
          message: `User ${req.params.userId} deleted.`,
          result
        });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
});

module.exports = router;
