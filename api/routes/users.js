const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../controllers/users');

const User = require('../models/user');

const router = express.Router();

router.get('/', UserController.users_get_all);

router.post('/signup', UserController.users_signup);

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: 'Authentication failed.'
          });
        }
        bcrypt.compare(req.body.password, user.password, (error, result) => {
          if (error) {
            return res.status(401).json({
              message: 'Authentication failed.'
            });
          }
          if (result) {
            const jwtPayload = {
              email: user.email,
              userId: user._id
            };
            const jwtSecret = process.env.JWT_SECRET;
            const jwtOptions = {
              expiresIn: '1h'
            };
            const token = jwt.sign(jwtPayload, jwtSecret, jwtOptions);
            return res.status(200).json({
              message: 'Authentication successful.',
              token
            });
          }
          res.status(401).json({
            message: 'Authentication failed.'
          });
        });
      })
      .catch(error => {
        res.status(500).json({ error });
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
