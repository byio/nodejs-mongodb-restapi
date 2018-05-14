const mongoose = require('mongoose');

const User = require('../models/user');

exports.users_get_all = (req, res, next) => {
  User.find()
      .select('-__v')
      .exec()
      .then(users => {
        res.status(200).json({
          users
        });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};
