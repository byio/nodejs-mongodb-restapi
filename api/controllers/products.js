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
