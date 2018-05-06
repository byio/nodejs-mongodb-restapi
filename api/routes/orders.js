const express = require('express');
const mongoose = require('mongoose');

// import order model
const Order = require('../models/order');

const router = express.Router();

router.get('/', (req, res, next) => {
  Order.find()
       .select('_id product quantity')
       .exec()
       .then(docs => {
         const jsonResponse = {
           count: docs.length,
           orders: docs.map(doc => {
             const { _id, product, quantity } = doc;
             return {
               _id, product, quantity,
               requests: [
                 {
                   type: 'GET',
                   url: `http://localhost:4000/orders/${_id}`,
                   description: 'get information about individual orders'
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
