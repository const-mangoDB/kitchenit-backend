'use strict';

const axios = require('axios');
const cache = require('./cache');
const Ingredient = require('../models/ingredient');

async function getRecipeList(req, res, next){
  // We will get all the ingredients that belong to the user and then do the filtering.
  getKitchenIngredients(req, res, next).then(kitchenIngredients => {
    const CACHE_KEY = 'recipes';
    // We'll set the reset on the recipe list cache data to be every week
    const cacheLife = 604800000;
    if (cache[CACHE_KEY] && (Date.now() - cache[CACHE_KEY].timestamp < cacheLife)) {
    // Cache hit
      cache[CACHE_KEY].timestamp = Date.now();
      const filteredRecipeList = getFilteredRecipeList(cache[CACHE_KEY].data, kitchenIngredients);
      console.log('Cache Hit');
      res.status(200).send(filteredRecipeList);
    } else {
    // Cache miss
      cache[CACHE_KEY].timestamp = Date.now();
      getFullRecipeList(next).then(fullRecipeList => {
        cache[CACHE_KEY].data = fullRecipeList;

        const filteredRecipeList = getFilteredRecipeList(cache[CACHE_KEY].data, kitchenIngredients);
        console.log('Cache Miss');
        res.status(200).send(filteredRecipeList);
      })
        .catch(err => next(err));
    }
  });
}

async function getKitchenIngredients(req, res, next) {
  try {
    let queryObject = {email: req.user.email};
    const ingredients = await Ingredient.find(queryObject);
    return ingredients;
  } catch(err) { next(err.message); }
}

async function getFullRecipeList(next) {
  try {
    const MEALDB_API_INGREDIENT_IMAGE_BASE_URL='https://themealdb.com/images/ingredients';
    const MEALDB_API_RECIPES_BASE_URL = `https://themealdb.com/api/json/v2/${process.env.MEALDB_API_KEY}/search.php`;
    const fullRecipeList = [];

    // TODO: i is set to 2 letters for testing so as not to hammer the API, but once deployed we should have i < 26 to cycle the entire alphabet
    for (let i = 0; i < process.env.MEALDB_API_FILTER_CALLS; i++) {
      const char = String.fromCharCode(97 + i);
      let searchUrl = `${MEALDB_API_RECIPES_BASE_URL}?f=${char}`;
      let filteredRecipeList = await axios.get(searchUrl)
        .then(resData => {
          if (resData.data.meals) {
            return resData.data.meals.map(element => new DetailedRecipe(element, MEALDB_API_INGREDIENT_IMAGE_BASE_URL));
          }
        });
      fullRecipeList.push(filteredRecipeList);
    }

    return await Promise.all(fullRecipeList).then((unsanitizedFullRecipeList) => {
      // Each promise returns an array that needs to be flattened. In addition, some promises will be null/undefined values if no recipes are found from that letter. These should be removed from the return array
      // eslint-disable-next-line eqeqeq
      const fullRecipeList = unsanitizedFullRecipeList.flat().filter((recipe) => recipe != null);
      return fullRecipeList;
    });
  } catch(err) {next(err);}
}

function getFilteredRecipeList(recipeList, kitchenIngredients) {
  const numberOfKitchenIngredients = kitchenIngredients.length;
  // Create a set with ingredients in it for filtering
  const ingredientSet = new Set();
  kitchenIngredients.forEach(ingredient => ingredientSet.add(ingredient.name));
  const filteredRecipeScores = [];
  // We want to stop iterating over the ingredients array in each recipe if we've reached the kitchen ingredient count
  recipeList.forEach((recipe, i) => {
    let ingredients = recipe.ingredients;
    let ingredientCount = 0;
    //Either loop through the whole ingredients array, or stop once we've hit the kitchen ingredient count
    for (let j = 0; j < ingredients.length; j++) {
      let ingredient = ingredients[j].ingredientName;
      if (ingredientSet.has(ingredient)) {
        ingredientCount++;
      }
      if (ingredientCount === numberOfKitchenIngredients) {
        break;
      }
    }
    //Only identify a recipe that has any kitchen ingredients
    if (ingredientCount > 0) {
      // We want to sort by a score expressed as a % of the total ingredients in the recipe already contained in the kitchen.
      let ingredientScore = Math.round((ingredientCount / ingredients.length) * 100);
      filteredRecipeScores.push({index: i, score: ingredientScore});
    }
  });

  // If no recipes are found return an empty array, otherwise return a filtered array sorted by recipe score heuristic above
  let filteredRecipeList = [];
  if (filteredRecipeScores.length > 0) {
    filteredRecipeList = filteredRecipeScores
      .sort((a, b) => b.score - a.score)
      .map(recipe => recipeList[recipe.index]);
  }

  return filteredRecipeList;
}

class DetailedRecipe {
  constructor(data, baseUrl) {
    this.name = data.strMeal;
    this.apiId = data.idMeal;
    this.imageUrl = data.strMealThumb;
    this.category = data.strArea;
    this.instructions = this.instructionsToArray(data);
    this.ingredients = this.ingredientsToArray(data, baseUrl);
  }

  instructionsToArray(data){
    const regex = /(?:\r\n)+/g;
    return data.strInstructions.split(regex);
  }

  ingredientsToArray(data, baseUrl) {
    let ingredientArray = [];
    for (let i = 1; i < 21; i++) {

      if (data[`strIngredient${i}`]) {

        const name = this.titleCase(data[`strIngredient${i}`]);

        const ingredient = {
          ingredientName: name,
          measurement: data[`strMeasure${i}`],
          // quantity: data[`strMeasure${i}`],
          // unit: data[`strMeasure${i}`],
          imageUrl: this.getImageUrl(name, baseUrl)
        };

        ingredientArray.push(ingredient);
      }
    }
    return ingredientArray;
  }

  // Not all data entered into the API is consistent with the ingredients dictionary casing. Ingredients are title cased to stay consistent for downstream filtering.
  titleCase(string) {
    return string.replace(/(^\w{1})|(\s+\w{1})/g, char => char.toUpperCase());
  }

  getImageUrl(name, baseUrl) {
    return `${baseUrl}/${name.replace(/\s+/g, '%20')}.png`;
  }
}

module.exports = getRecipeList;

