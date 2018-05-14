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

router.post('/', checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
         .then(product => {
           if (!product) {
             return res.status(404).json({
               message: 'Product not found.'
             });
           }
           const newOrder = new Order({
             _id: mongoose.Types.ObjectId(),
             product: req.body.productId,
             quantity: req.body.quantity
           });
           return newOrder.save();
         })
         .then(result => {
            const { _id, product, quantity } = result;
            const jsonResponse = {
              message: 'New order created!',
              createdOrder: {
                _id, product, quantity
              },
              requests: [
                {
                  type: 'GET',
                  url: `http://localhost:4000/orders/${_id}`,
                  description: 'get information about individual orders'
                }
              ]
            };
            res.status(201).json(jsonResponse);
          })
          .catch(error => {
            res.status(500).json({
              message: 'Cannot add invalid product',
              error
            });
          });
});

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
