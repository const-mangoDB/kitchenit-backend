'use strict'

const axios = require('axios');
const cache = require('./cache');

async function getRecipeList(req, res, next){
    const startTime = Date.now();
    // TODO: Set up req.body for ingredients
    let ingredients = {
        'Butter': true,
        'Almond Extract': true,
    };

    const CACHE_KEY = 'recipes';
    // We'll set the reset on the recipe list cache data to be every week
    const cacheLife = 604800000;
    if (cache[CACHE_KEY] && (Date.now() - cache[CACHE_KEY].timestamp < cacheLife)) {
        // Cache hit
        cache[CACHE_KEY].timestamp = Date.now();
        const filteredRecipeList = getFilteredRecipeList(cache[CACHE_KEY].data, ingredients);
        const timeElapsed = Date.now() - startTime;
        console.log('getRecipeList time elapsed: ', `${timeElapsed} ms`);
        res.status(200).send(filteredRecipeList);
    } else {
        // Cache miss
        cache[CACHE_KEY].timestamp = Date.now();
        getFullRecipeList().then(fullRecipeList => {
            cache[CACHE_KEY].data = fullRecipeList
            const filteredRecipeList = getFilteredRecipeList(cache[CACHE_KEY].data, ingredients);
            const timeElapsed = Date.now() - startTime;
            console.log('getRecipeList time elapsed: ', `${timeElapsed} ms`);
            res.status(200).send(filteredRecipeList);
        })
        .catch(err => next(err));
    }
}

async function getFullRecipeList() {
    try {
        const startTime = Date.now();
        const baseUrl = `https://themealdb.com/api/json/v2/${process.env.MEALDB_API_KEY}/search.php`;
        const fullRecipeList = [];

        for (let i = 0; i < 26; i++) {
            const char = String.fromCharCode(97 + i);
            let searchUrl = `${baseUrl}?f=${char}`;
            let filteredRecipeList = await axios.get(searchUrl)
            .then(resData => {
                if (resData.data.meals) {
                    return resData.data.meals.map(element => new DetailedRecipe(element));
                }
            });
            fullRecipeList.push(filteredRecipeList);
        }

        return await Promise.all(fullRecipeList).then((unsanitizedFullRecipeList) => {
            const timeElapsed = Date.now() - startTime;
            console.log('getFullRecipeList time elapsed: ', `${timeElapsed} ms`);
            // Each promise returns an array that needs to be flattened. In addition, some promises will be null values if no recipes are found from that letter. These should be removed from the return array
            const fullRecipeList = unsanitizedFullRecipeList.flat().filter((recipe) => recipe != null);
            return fullRecipeList;
        })
    } catch(err) {next(err)};
}

function getFilteredRecipeList(recipeList, kitchenIngredients) {
    const filteredRecipeScores = [];
    // We want to stop iterating over the ingredients array in each recipe if we've reached the ingredient count
    const numberOfKitchenIngredients = Object.keys(kitchenIngredients).length;
    
    recipeList.forEach((recipe, i) => {
        let ingredients = recipe.ingredients;
        let ingredientCount = 0;
        let j = 0;
        //Either loop through the whole ingredients array, or stop once we've hit the kitchen ingredient count
        for (j = 0; j< ingredients.length; j++) {
            let ingredient = ingredients[j].ingredientName;
            if (ingredient in kitchenIngredients) {
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
    })

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
    constructor(data) {
        this.apiID = data.idMeal;
        this.name = data.strMeal;
        this.apiParamName = data.strMeal;
        this.imageURL = data.strMealThumb;
        this.category = data.strArea;
        this.instructions = this.instructionsToArray(data);
        this.ingredients = this.ingredientsToArray(data);
    }

    instructionsToArray(data){
        const regex = /(?:\r\n)+/g
        return data.strInstructions.split(regex);
    }

    // TODO: Split up quantity and unit
    ingredientsToArray(data) {
        let ingredientArray = [];
        for (let i = 1; i < 21; i++) {

            if (data[`strIngredient${i}`]) {

                // let patternQuant = //
                // let patternUnit = //

                const ingredient = {
                    ingredientName: this.titleCase(data[`strIngredient${i}`]),
                    quantity: data[`strMeasure${i}`],
                    unit: data[`strMeasure${i}`]
                }

                ingredientArray.push(ingredient);
            }
        }
        return ingredientArray;
    }

    // Not all data entered into the API is consistent with the ingredients dictionary casing. Ingredients are title cased to stay consistent for downstream filtering.
    titleCase(string) {
        return string.replace(/(^\w{1})|(\s+\w{1})/g, char => char.toUpperCase());
    }
}

module.exports = getRecipeList;

