'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const verifyUser = require('./authorize');
const ingredientHandler = require('./modules/ingredientHandler');
const recipeHandler = require('./modules/recipeHandler');
const getIngredientDictionary = require('./modules/getIngredientDictionary');
const getRecipeList= require('./modules/getRecipeList');

const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyUser);

// route to get ingredient dictionary
app.get('/ingredients/dictionary', getIngredientDictionary);


const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URL);

const db = mongoose.connection;

// listening for errors in case something goes wrong
db.on('error', console.error.bind(console, 'connection error'));

// runs on open when the console log is connected
db.once('open', () => console.log('Mongoose is connected'));

app.get('/test', (request, response) => {

  response.send('test request received');

});

// route to get all kitchen ingredients
app.get('/ingredients', ingredientHandler.getIngredients);

// route to add one ingredient
app.post('/ingredients', ingredientHandler.postIngredient);

// route to delete one ingredient
app.delete('/ingredients/:id', ingredientHandler.deleteIngredient);

// route to get all cookbook recipes
app.get('/cookbook', recipeHandler.getFavoriteRecipes);

// route to add one recipe
app.post('/cookbook', recipeHandler.postFavoriteRecipe);

// route to delete one recipe
app.delete('/cookbook/:id', recipeHandler.deleteFavoriteRecipe);

// route to get all recipes that match ingredients in kitchen
app.get('/recipes', getRecipeList);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
