const express = require('express');
const mongoose = require('mongoose');

// import order model
const Order = require('../models/order');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /orders'
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: `Handling GET requests to /orders/${req.params.orderId}`
  })
});

router.post('/', (req, res, next) => {
  const newOrder = new Order({
    _id: mongoose.Types.ObjectId(),
    product: req.body.productId,
    quantity: req.body.quantity
  });
  newOrder.save()
       .then(result => {
         res.status(201).json(result);
       })
       .catch(error => {
         console.log(error);
         res.status(500).json({ error });
       });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: `Handling DELETE requests to /orders/${req.params.orderId}`
  });
});

module.exports = router;
