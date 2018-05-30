const mongoose = require('mongoose');

const User = require('../models/user');

module.exports = (req, res, next) => {
  if (!req.userData) {
    return res.status(401).json({
      message: 'Please authenticate.'
    });
  }
  User.findById(req.userData.decoded.userId)
      .then(user => {
        if (!user.adminStatus) {
          return res.status(403).json({
            message: 'You need to be an administrator to perform this action.'
          });
        }
        return next();
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};
