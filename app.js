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

// middleware to set headers to allow CORS (must come before routes middleware)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

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
