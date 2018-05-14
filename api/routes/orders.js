const express = require('express');

const checkAuth = require('../middleware/check-auth');

// import orders-related controller
const OrderController = require('../controllers/orders');

const router = express.Router();

router.get('/', checkAuth, OrderController.orders_get_all);

router.get('/:orderId', checkAuth, OrderController.orders_get_one);

router.post('/', checkAuth, OrderController.orders_create_one);

router.delete('/:orderId', checkAuth, OrderController.orders_delete_one);

module.exports = router;
