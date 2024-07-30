const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const protectAdminRoutes = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {      
    token = req.headers.authorization.split(' ')[1]; 
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.admin = await Admin.findById(decoded.id);

      if (!req.admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {    
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectAdminRoutes };
