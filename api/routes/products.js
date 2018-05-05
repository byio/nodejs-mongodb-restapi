const express = require('express');
const mongoose = require('mongoose');

// import product model
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
         .select('_id name price')
         .exec()
         .then(docs => {
           // console.log(docs);
           const jsonResponse = {
             count: docs.length,
             products: docs.map(doc => {
               const { _id, name, price } = doc;
               return {
                 _id,
                 name,
                 price,
                 requests: [
                   {
                     type: 'GET',
                     url: `http://localhost:4000/products/${_id}`,
                     description: 'retrieve data about individual products'
                   }
                 ]
               };
             })
           };
           res.status(200).json(jsonResponse);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
         .select('_id name price')
         .exec()
         .then(doc => {
           // console.log(doc);
           // check that doc exists (not null, which is returned for valid but non-existent ID)
           if (doc) {
            const jsonResponse = {
              product: doc,
              requests: [
                {
                  type: 'GET',
                  url: 'http://localhost:4000/products',
                  description: 'retrieve data about all products'
                }
              ]
            };
            res.status(200).json(jsonResponse);
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
           // console.log(result);
           const { _id, name, price } = result;
           const jsonResponse = {
             message: 'Created product successfully!',
             _id,
             name,
             price,
             requests: [
               {
                 type: 'GET',
                 url: `http://localhost:4000/products/${_id}`,
                 description: 'retrieve data about individual products'
               }
             ]
           };
           res.status(201).json(jsonResponse);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

router.patch('/:productId', (req, res, next) => {
  const updateOps = {};
  // iterate through request body
  for (const ops of req.body) {
    /*
      for each property in the request body, add it to the updateOps object
    */
    updateOps[ops.propName] = ops.value;
  }
  // update product using mongoose
  Product.update(
    { _id: req.params.productId },
    { $set: updateOps }
  ).exec()
   .then(result => {
     console.log(result);
     res.status(200).json(result);
   })
   .catch(error => {
     console.log(error);
     res.status(500).json({ error });
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
