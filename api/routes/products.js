const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

// import product model
const Product = require('../models/product');

const router = express.Router();

// initialize multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
   storage,
   limits: {
     fileSize: 1024 * 1024 * 5
   },
   fileFilter
});

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
         .then(product => {
           // console.log(doc);
           // check that doc exists (not null, which is returned for valid but non-existent ID)
           if (!product) {
             return res.status(404).json({
               message: 'No valid entry found.'
             });
           }
           const jsonResponse = {
             product,
             requests: [
               {
                 type: 'GET',
                 url: 'http://localhost:4000/products',
                 description: 'retrieve data about all products'
               }
             ]
           };
           res.status(200).json(jsonResponse);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error })
         });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
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
    // for each property in the request body, add it to the updateOps object
    updateOps[ops.propName] = ops.value;
  }
  // update product using mongoose
  Product.update(
    { _id: req.params.productId },
    { $set: updateOps }
  ).exec()
   .then(result => {
     // console.log(result);
     const changes = req.body.map(change => change.propName);
     const jsonResponse = {
       message: 'Product information updated successfully!',
       changes,
       requests: [
         {
           type: 'GET',
           url: `http://localhost:4000/products/${req.params.productId}`,
           description: `retrieve data about product with id: ${req.params.productId}`
         }
       ]
     };
     res.status(200).json(jsonResponse);
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
           // console.log(result);
           const jsonResponse = {
             message: `Product with ID ${req.params.productId} has been deleted successfully!`,
             requests: [
               {
                 type: 'POST',
                 url: 'http://localhost:4000/products',
                 body: { name: 'String', price: 'Number' },
                 description: 'create a new product'
               }
             ]
           };
           res.status(200).json(jsonResponse);
         })
         .catch(error => {
           console.log(error);
           res.status(500).json({ error });
         });
});

module.exports = router;
