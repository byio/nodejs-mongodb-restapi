const express = require('express');

const UserController = require('../controllers/users');

const router = express.Router();

router.get('/', UserController.users_get_all);

router.get('/:userId', UserController.users_get_one);

router.post('/signup', UserController.users_signup);

router.post('/login', UserController.users_login);

router.delete('/:userId', UserController.users_delete_one);

module.exports = router;
