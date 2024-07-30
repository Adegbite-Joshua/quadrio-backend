const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const protectAdminRoutes = async (req, res, next) => {
  let token;

  console.log(req.cookies);
  console.log(req.cookies.token);
  if (req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from the token
      req.admin = await Admin.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectAdminRoutes };