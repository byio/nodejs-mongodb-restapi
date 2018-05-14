const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
  Order.find()
       .select('_id product quantity')
       .populate('product', 'name')
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
};
