const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  // return res.json({ token });
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, decoded) => {
      if (error) {
        return res.status(500).json({
          message: 'Authentication required.'
        });
      }
      req.userData = {
        status: 'verified',
        decoded
      };
      next();
    }
  );
};
