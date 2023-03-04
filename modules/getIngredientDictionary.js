'use strict';

const axios = require('axios');
const cache = require('./cache');

// TODO: Add a get route for the list all ingredients with cache functionality
function getIngredientDictionary(req, res, next) {
  const MEALDB_API_INGREDIENTS_LIST_URL = `https://themealdb.com/api/json/v2/${process.env.MEALDB_API_KEY}/list.php?i=list`;
  const MEALDB_API_INGREDIENT_IMAGE_BASE_URL='https://themealdb.com/images/ingredients';

  const CACHE_KEY = 'ingredients';
  // We'll set the reset on the ingredient dictionary cache data to be a day
  const cacheLife = 86400000;
  if (cache[CACHE_KEY] && (Date.now() - cache[CACHE_KEY].timestamp < cacheLife)) {
    // Cache hit
    cache[CACHE_KEY].timestamp = Date.now();
    res.status(200).send(cache[CACHE_KEY].data);
  } else {
    // Cache miss
    cache[CACHE_KEY].timestamp = Date.now();
    axios.get(MEALDB_API_INGREDIENTS_LIST_URL)
      .then(resData => {
        const sanitizedIngredientsDictionary = resData.data.meals
          .map(ingredient => {
            return new Ingredient(ingredient, MEALDB_API_INGREDIENT_IMAGE_BASE_URL);
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        cache[CACHE_KEY].data = sanitizedIngredientsDictionary;
        res.status(200).send(cache[CACHE_KEY].data);
      })
      .catch(err => next(err));
  }
}

class Ingredient {
  constructor(ingredient, baseUrl) {
    this.name = ingredient.strIngredient;
    this.apiParamName = this.paramify(this.name);
    this.description = ingredient.strDescription;
    this.imageUrl = this.getImageUrl(this.name, baseUrl);
  }

  paramify (name) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }

  getImageUrl (name, baseUrl) {
    return `${baseUrl}/${name.replace(/\s+/g, '%20')}.png`;
  }
}

module.exports = getIngredientDictionary;
