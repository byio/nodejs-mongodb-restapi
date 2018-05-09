const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'GET /users'
  });
});

module.exports = router;
