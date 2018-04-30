const express = require('express');
const mongoose = require('mongoose');

// import product model
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'You have passed the special ID!',
      id
    });
  } else {
    res.status(200).json({
      message: `You have passed a regular ID of ${id}`
    });
  }
});

router.post('/', (req, res, next) => {
  const createdProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  createdProduct.save()
         .then(result => console.log(result))
         .catch(err => console.log(err));
  res.status(201).json({
    message: 'Handling POST requests to /products',
    createdProduct
  });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: `Patched product of ID: ${req.params.productId}`
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: `Deleted product of ID: ${req.params.productId}`
  });
});

module.exports = router;
