const express = require('express');
const { adminSignup, adminLogin, getAdminDetails } = require('../controllers/admin.controller');
const { protectAdminRoutes } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/details', protectAdminRoutes, getAdminDetails);


module.exports = router;
