const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_get_all = (req, res, next) => {
  User.find()
      .select('-__v')
      .exec()
      .then(users => {
        const jsonResponse = {
          count: users.length,
          users: users.map(user => {
            const { _id, username, email } = user;
            return {
              _id,
              username,
              email,
              requests: [
                {
                  type: 'POST',
                  url: 'http://localhost:4000/users/signup',
                  body: {
                    username: 'String',
                    email: 'Email',
                    password: 'String'
                  },
                  description: 'Register new user.'
                }
              ]
            };
          })
        };
        res.status(200).json(jsonResponse);
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};

exports.users_get_one = (req, res, next) => {
  User.findById(req.params.userId)
      .select('-__v')
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found.'
          });
        }
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};

exports.users_signup = (req, res, next) => {
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
};

exports.users_login = (req, res, next) => {
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
};

exports.users_delete_one = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
      .exec()
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found.'
          });
        }
        User.remove({ _id: userId })
            .then(result => {
              res.status(200).json({
                message: `User ${req.params.userId} deleted.`,
                result
              });
            })
            .catch(error => {
              res.status(500).json({ error });
            });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};
