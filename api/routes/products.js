const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const checkAuth = require('../middleware/check-auth');

// import products-related controller
const ProductControllers = require('../controllers/products');

// import product model
const Product = require('../models/product');

const router = express.Router();

// initialize multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png/;
  const extMatch = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimeMatch = allowedExt.test(file.mimetype);
  if (extMatch && mimeMatch) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file extension.'), false);
  }
};
const upload = multer({
   storage,
   limits: {
     fileSize: 1024 * 1024 * 5
   },
   fileFilter
});

router.get('/', ProductControllers.products_get_all);

router.get('/:productId', ProductControllers.products_get_one);

router.post('/', checkAuth, upload.single('productImage'), ProductControllers.products_create_new);

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete('/:productId', checkAuth, (req, res, next) => {
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
