const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
