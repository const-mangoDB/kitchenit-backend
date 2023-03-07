const Recipe = require('../models/recipe');

const recipeHandler = {};

recipeHandler.getFavoriteRecipes = function (req, res, next) {
  let queryObject = {email: req.user.email};
  Recipe.find(queryObject)
    .then(data => res.status(200).send(data))
    .catch(err => next(err));
};

recipeHandler.postFavoriteRecipe = function (req, res, next) {
  const data = {...req.body, email: req.user.email};
  Recipe.create(data)
    .then(createdRecipe => res.status(200).send(createdRecipe))
    .catch(err => next(err));
};

recipeHandler.deleteFavoriteRecipe = function (req, res, next) {
  const id = req.params.id;
  const userEmail = req.user.email;
  Recipe.findById(id)
    .then(recipe => {
      if (recipe.email !== userEmail) {
        res.status(403).send('Not Authorized');
      }
      else {
        Recipe.deleteOne({_id: recipe._id})
          .then(deletedRecipe => {
            // Using == for both null and undefined
            // eslint-disable-next-line eqeqeq
            if (deletedRecipe == null) {
              res.status(404).send('Cannot find recipe.');
            }
            else {
              res.status(200).send(`Deleted recipe ${deletedRecipe.name}`);
            }
          });
      }
    })
    .catch(err => next(err));
};

module.exports = recipeHandler;
