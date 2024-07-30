const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const itemRoutes = require('./routes/item.route');
const adminRoutes = require('./routes/admin.route');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan("dev"));  // Log HTTP requests to console for development
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://quadrio-frontend.vercel.app'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


// Connect to database
connectDB();

// Routes
app.get('/', (req, res)=>{
  res.json({message: "Welcome to Quadrio assignment backend!"})
})
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);

// catch 404 errors and forward them to error handler
app.use((_req, _res, next) => {
  const error = new Error("Not Found");
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use((error, _req, res, _next) => {
  res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
