const express = require('express');
const mongoose = require('mongoose');

// import product model
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
         .exec()
         .then(docs => {
           console.log(docs);
           res.status(200).json(docs);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
         .exec()
         .then(doc => {
           console.log(doc);
           // check that doc exists (not null, which is returned for valid but non-existent ID)
           if (doc) {
            res.status(200).json(doc);
          } else {
            // ... else if null is returned (ID valid but non-existent)
            res.status(404).json({ message: 'No valid entry found.' });
          }
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error })
         });
});

router.post('/', (req, res, next) => {
  const createdProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  createdProduct.save()
         .then(result => {
           console.log(result);
           res.status(201).json({
             message: 'Handling POST requests to /products',
             createdProduct
           });
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: `Patched product of ID: ${req.params.productId}`
  });
});

router.delete('/:productId', (req, res, next) => {
  Product.remove({ _id: req.params.productId })
         .exec()
         .then(result => {
           console.log(result);
           res.status(200).json(result);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

module.exports = router;
