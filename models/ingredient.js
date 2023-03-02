'use strict';

const mongoose = require('mongoose');

// deconstructing schema out of mongoose
const {Schema} = mongoose;

// Creating schema layout
const ingredientSchema = new Schema({
  name: String,
  apiParamName: String,
  description: String,
  imageUrl: String,
  quantity: Number,
  unit: String,
  email: String
});

// STRETCH: 'quantity' and 'unit' will be used in quantity stretch goal

// Exporting model
module.exports = mongoose.model('Ingredient', ingredientSchema);