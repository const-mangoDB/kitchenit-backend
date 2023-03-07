'use strict';

const mongoose = require('mongoose');

// deconstructing schema out of mongoose
const {Schema} = mongoose;

// Creating schema layout
const ingredientSchema = new Schema({
  name: String,
  description: String,
  imageUrl: String,
  email: String
});

// Exporting model
module.exports = mongoose.model('Ingredient', ingredientSchema);
