const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
  Product.find()
         .select('_id name price productImage')
         .exec()
         .then(docs => {
           // console.log(docs);
           const jsonResponse = {
             count: docs.length,
             products: docs.map(doc => {
               const { _id, name, price, productImage } = doc;
               return {
                 _id,
                 name,
                 price,
                 productImage,
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
};

exports.products_get_one = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
         .select('_id name price productImage')
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
};

exports.products_create_new = (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      message: 'Please provide a valid product image (productImage).'
    });
  };
  // console.log(req.file);
  const createdProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  createdProduct.save()
         .then(result => {
           // console.log(result);
           const { _id, name, price, productImage } = result;
           const jsonResponse = {
             message: 'Created product successfully!',
             _id,
             name,
             price,
             productImage,
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
};
