const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { readdirSync } = require('fs');
const { inject } = require("@vercel/analytics");

const app = express();
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// Routes
readdirSync('./routes').map(r => app.use('/', require('./routes/' + r)));

app.get('/', async (req, res) => {
  res.send('Welcome to offers listing app');
});

inject()

module.exports = app;