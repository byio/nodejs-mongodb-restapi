const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// import routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// morgan logger middleware
app.use(morgan('dev'));

// set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// handling errors
  // middleware to create a 'not found' error if a request is not caught by any of the previous middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
  // middleware to catch all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500)
     .json({
       error: {
         message: error.message
       }
     });
});

module.exports = app;
