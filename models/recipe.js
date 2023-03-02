'use strict';

const mongoose = require('mongoose');

// deconstructing schema out of mongoose
const {Schema} = mongoose;

// Creating schema layout
const recipeSchema = new Schema({
  name: String,
  apiId: String,
  apiParamName: String,
  instructions: [String],
  ingredients: [{
    ingredientName: String,
    quantity: Number,
    unit: String
  }],
  email: String
});

// STRETCH: 'quantity' and 'unit' will be used in quantity stretch goal

// Exporting model
module.exports = mongoose.model('Recipe', recipeSchema);