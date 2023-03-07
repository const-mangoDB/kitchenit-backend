'use strict';

const mongoose = require('mongoose');

// deconstructing schema out of mongoose
const {Schema} = mongoose;

// Creating schema layout
const recipeSchema = new Schema({
  name: String,
  apiId: String,
  category: String,
  imageUrl: String,
  instructions: [String],
  ingredients: [{
    ingredientName: String,
    measurement: String,
    imageUrl: String
  }],
  email: String
});

// Exporting model
module.exports = mongoose.model('Recipe', recipeSchema);
