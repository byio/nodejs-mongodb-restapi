const express = require('express');

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
  const createdOrder = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: 'Handling POST requests to /orders',
    createdOrder
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: `Handling DELETE requests to /orders/${req.params.orderId}`
  });
});

module.exports = router;
