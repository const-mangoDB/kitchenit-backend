'use strict';

const Ingredient = require('../models/ingredient');

const ingredientHandler = {};

ingredientHandler.getIngredients = function (req, res, next) {
  let queryObject = {};
  Ingredient.find(queryObject)
    .then(data => res.status(200).send(data))
    .catch(err => next(err));
};

ingredientHandler.postIngredient = function (req, res, next) {
  const data = req.body;
  Ingredient.create(data)
    .then(createdIngredient => res.status(200).send(createdIngredient))
    .catch(err => next(err));
};

ingredientHandler.deleteIngredient = function (req, res, next) {
  const id = req.params.id;
  Ingredient.findByIdAndDelete(id)
    .then(deletedIngredient => res.status(200).send(deletedIngredient))
    .catch(err => next(err));
};

// STRETCH TODO: Add PUT functionality for quantity modification

module.exports = ingredientHandler;
