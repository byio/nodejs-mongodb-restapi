const express = require('express');

const app = express();

// import routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// routes middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
