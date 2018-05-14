const mongoose = require('mongoose');

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
