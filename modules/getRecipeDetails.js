'use strict'

const axios = require('axios');

function getRecipeDetails(req, res, next) {

    const baseURL = '';
    const searchURL = '';

    axios.get(searchURL)
        .then(resData => {
            let formattedRecipeData = resData.data.meals.map(element => new DetailedRecipe(element));
            res.status(200).send(formattedRecipeData);
        })
        .catch(error => next(error));

    class DetailedRecipe {
        constructor(data) {
            this.apiID = data.idMeal;
            this.name = data.strMeal;
            this.apiParamName = data.strMeal;
            this.imageURL = data.strMealThumb;
            this.category = data.strArea;
            this.instructions = instructionsToArray(data);
            this.ingredients = ingredientsToArray(data);
            this.email = null;
        }

        instructionsToArray(data){
            return (data.strInstructions.split(".\s"));
        }


        // TODO: Split up quantity and unit
        ingredientsToArray(data) {
            let ingredientArray = [];
            for (let i = 1; i < 21; i++) {

                if (data[`strIngredient${i}`]) {

                    // let patternQuant = //
                    // let patternUnit = //

                    const ingredient = {
                        ingredientName: data[`strIngredient${i}`],
                        quantity: data[`strMeasure${i}`],
                        unit: data[`strMeasure${i}`]
                    }

                    ingredientArray.push(ingredient);
                }
            }
            return ingredientArray;
        }
    }
}

module.exports = getRecipeDetails;