const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendTokenResponse = (admin, res) => {
  const token = generateToken(admin._id);

  res.cookie('token', token, { 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
    secure: true,
    sameSite: 'None'
  });

  res.status(200).json({ _id: admin._id, email: admin.email, token});
};

const adminSignup = async (req, res) => {
  const { email, password, username } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  const admin = await Admin.create({
    email,
    password,
    username
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    sendTokenResponse(admin, res);
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getAdminDetails = async (req, res) => {
  const admin = req.admin;
  res.status(200).json(admin);
};


module.exports = { adminSignup, adminLogin, getAdminDetails}