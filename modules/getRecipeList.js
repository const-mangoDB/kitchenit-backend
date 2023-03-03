'use strict'

const axios = require('axios');
const {response} = require('express');

function getRecipeList(req, res, next){

    const baseURL = '';
    const searchURL = '';

    axios.get(searchURL)
    .then(data => {
        let formattedRecipeData = data.data.meals.map(element => new BaseRecipe(element));
        res.status(200).send(formattedRecipeData);    
    })
    .catch(error => next(error));

    class BaseRecipe{
        constructor(data){
            this.apiID = data.idMeal;
            this.name = data.strMeal;
            this.imageURL = data.strMealThumb;
        }
    }
}

module.exports = getRecipeList;

