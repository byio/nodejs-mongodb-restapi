const express = require('express');
const multer = require('multer');
const path = require('path');

const checkAuth = require('../middleware/check-auth');

// import products-related controller
const ProductControllers = require('../controllers/products');

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

router.patch('/:productId', checkAuth, ProductControllers.products_update_one);

router.delete('/:productId', checkAuth, ProductControllers.products_delete_one);

module.exports = router;
