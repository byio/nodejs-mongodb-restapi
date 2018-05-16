const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
  Order.find()
       .select('_id user product quantity')
       .populate('product', 'name')
       .populate('user', 'email')
       .exec()
       .then(docs => {
         const jsonResponse = {
           count: docs.length,
           orders: docs.map(doc => {
             const { _id, user, product, quantity } = doc;
             return {
               _id, user, product, quantity,
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

exports.orders_create_one = (req, res, next) => {
  Product.findById(req.body.productId)
         .then(product => {
           if (!product) {
             return res.status(404).json({
               message: 'Product not found.'
             });
           }
           const newOrder = new Order({
             _id: mongoose.Types.ObjectId(),
             user: req.body.userId,
             product: req.body.productId,
             quantity: req.body.quantity
           });
           return newOrder.save();
         })
         .then(result => {
            const { _id, user, product, quantity } = result;
            const jsonResponse = {
              message: 'New order created!',
              createdOrder: {
                _id, user, product, quantity
              },
              requests: [
                {
                  type: 'GET',
                  url: `http://localhost:4000/orders/${_id}`,
                  description: 'get information about individual orders'
                }
              ]
            };
            res.status(201).json(jsonResponse);
          })
          .catch(error => {
            res.status(500).json({
              message: 'Cannot create order.',
              error
            });
          });
};

exports.orders_delete_one = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
       .exec()
       .then(order => {
         if (!order) {
           return res.status(404).json({
             message: 'Order not found.'
           });
         }
         Order.remove({ _id: req.params.orderId })
              .exec()
              .then(result => {
                const jsonResponse = {
                  message: `Order ${req.params.orderId} deleted successfully!`,
                  requests: [
                    {
                      type: 'POST',
                      url: 'http://localhost:4000/orders',
                      body: { productId: 'ID', quantity:'Number' },
                      description: 'create a new order'
                    }
                  ]
                };
                res.status(200).json(jsonResponse);
              })
              .catch(error => {
                res.status(500).json({ error });
              });
       })
       .catch(error => {
         res.status(500).json({ error });
       });

};
