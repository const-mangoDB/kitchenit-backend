'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const verifyUser = require('./authorize');
const ingredientHandler = require('./modules/ingredientHandler');
const getIngredientDictionary = require('./modules/getIngredientDictionary');
const getRecipeList= require('./modules/getRecipeList');

const app = express();
app.use(cors());
app.use(express.json());
// app.use(verifyUser);

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

// route to get all kitchen ingredients
app.get('/ingredients', ingredientHandler.getIngredients);

// route to get ingredient dictionary
app.get('/ingredients/dictionary', getIngredientDictionary);

// route to add one ingredient
app.post('/ingredients', ingredientHandler.postIngredient);

// route to delete one ingredient
app.delete('/ingredients/:id', ingredientHandler.deleteIngredient);

// route to get all cookbook recipes
// app.get('/cookbook', recipeHandler.getIngredients);

// route to get all recipes that match ingredients in kitchen
app.get('/recipes', getRecipeList);

// route to add one recipe
// app.post('/cookbook', recipeHandler.postIngredient);

// route to delete one recipe
// app.delete('/cookbook/:id', recipeHandler.deleteIngredient);

app.listen(PORT, () => console.log(`listening on ${PORT}`));