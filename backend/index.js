// server.js
const express = require('express');
const connectDB = require('./DataBase/mongoDB');
const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();


// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use candidate routes
const candidateRoutes = require('./routes/candidateRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');
app.use('/api/candidates', candidateRoutes);
app.use('/api/users',userRoutes );
app.use('/api', otpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
