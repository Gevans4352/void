const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./Routes/auth')
const fragmentRoutes = require('./Routes/fragments');




app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/fragments', fragmentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Void API is alive' })
})

module.exports = app;