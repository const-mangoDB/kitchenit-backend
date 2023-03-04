'use strict';

const mongoose = require('mongoose');

// deconstructing schema out of mongoose
const {Schema} = mongoose;

// Creating schema layout
const recipeSchema = new Schema({
  name: String,
  apiId: String,
  category: String,
  instructions: [String],
  ingredients: [{
    ingredientName: String,
    measurement: String,
    imageUrl: String
    // quantity: Number,
    // unit: String,
  }],
  email: String
});

// STRETCH TODO: 'quantity' and 'unit' will be used in quantity stretch goal

// Exporting model
module.exports = mongoose.model('Recipe', recipeSchema);
