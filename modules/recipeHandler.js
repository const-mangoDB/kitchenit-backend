const Recipe = require('../models/recipe');

const recipeHandler = {};

recipeHandler.getFavoriteRecipes = function (req, res, next) {
  let queryObject = {};
  Recipe.find(queryObject)
    .then(data => res.status(200).send(data))
    .catch(err => next(err));
};

recipeHandler.postFavoriteRecipe = function (req, res, next) {
  const data = req.body;
  Recipe.create(data)
    .then(createdRecipe => res.status(200).send(createdRecipe))
    .catch(err => next(err));
};

recipeHandler.deleteFavoriteRecipe = function (req, res, next) {
  const id = req.params.id;
  Recipe.findByIdAndDelete(id)
    .then(deletedrecipe => res.status(200).send(deletedrecipe))
    .catch(err => next(err));
};

module.exports = recipeHandler;
