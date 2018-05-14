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

exports.orders_get_one = (req, res, next) => {
  Order.findById(req.params.orderId)
       .select('_id product quantity')
       .populate('product', '-__v')
       .exec()
       .then(order => {
         if (!order) {
           return res.status(404).json({
             message: 'Order not found.'
           });
         }
         const jsonResponse = {
           message: `Order ${req.params.orderId} found.`,
           order,
           requests: [
             {
               type: 'GET',
               url: 'http://localhost:4000/orders',
               description: 'retrieve data about all orders'
             }
           ]
         };
         res.status(200).json(jsonResponse);
       })
       .catch(error => {
         res.status(500).json({ error });
       });
};
