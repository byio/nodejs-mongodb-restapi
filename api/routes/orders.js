const express = require('express');
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

// import orders-related controller
const OrderController = require('../controllers/orders');

// import order model
const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();

router.get('/', checkAuth, OrderController.orders_get_all);

router.get('/:orderId', checkAuth, OrderController.orders_get_one);

router.post('/', checkAuth, OrderController.orders_create_one);

router.delete('/:orderId', checkAuth, (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
       .exec()
       .then(result => {
         const jsonResponse = {
           message: `Order ${req.params.orderId} deleted successfully!`,
           requests: [
             {
               type: 'POST',
               url: 'http://localhost:4000/orders',
               body: { productId: 'ID', quantity:'Number' },
               description: 'create a new order'
             }
           ]
         };
         res.status(200).json(jsonResponse);
       })
       .catch(error => {
         res.status(500).json({ error });
       });
});

module.exports = router;
