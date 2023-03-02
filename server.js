'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const verifyUser = require('./authorize');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

// listening for errors in case something goes wrong
db.on('error', console.error.bind(console, 'connection error'));

// runs on open when the console log is connected
db.once('open', () => console.log('Mongoose is connected'))

app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));