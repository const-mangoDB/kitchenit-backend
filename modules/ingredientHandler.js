'use strict';

const Ingredient = require('../models/ingredient');

const ingredientHandler = {};

ingredientHandler.getIngredients = function (req, res, next) {
  let queryObject = {email: req.user.email};
  Ingredient.find(queryObject)
    .then(data => res.status(200).send(data))
    .catch(err => next(err));
};

ingredientHandler.postIngredient = function (req, res, next) {
  const data = {...req.body, email: req.user.email};
  Ingredient.create(data)
    .then(createdIngredient => res.status(200).send(createdIngredient))
    .catch(err => next(err));
};

ingredientHandler.deleteIngredient = function (req, res, next) {
  const id = req.params.id;
  const userEmail = req.user.email;
  Ingredient.findById(id)
    .then(ingredient => {
      if (ingredient.email !== userEmail) {
        res.status(403).send('Not Authorized');
      }
      else {
        Ingredient.deleteOne({_id: ingredient._id})
          .then(deletedIngredient => {
            // Using == for both null and undefined
            // eslint-disable-next-line eqeqeq
            if (deletedIngredient == null) {
              res.status(404).send('Cannot find ingredient.');
            }
            else {
              res.status(200).send(`Deleted ingredient ${deletedIngredient.name}`);
            }
          });
      }
    })
    .catch(err => next(err));
};

module.exports = ingredientHandler;
