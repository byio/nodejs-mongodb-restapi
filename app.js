const express = require('express');

const app = express();

// import routes
const productRoutes = require('./api/routes/products');

// routes middleware
app.use('/products', productRoutes);

module.exports = app;
