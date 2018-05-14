const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = require('../controllers/users');

const User = require('../models/user');

const router = express.Router();

router.get('/', UserController.users_get_all);

router.post('/signup', UserController.users_signup);

router.post('/login', UserController.users_login);

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
