'use strict'

const axios = require('axios');

function getRecipeList(req, res, next){

    const params = req.query.i;
    const searchUrl = `https://themealdb.com/api/json/v2/${process.env.MEALDB_API_KEY}/filter.php?i=${params}`;
    console.log('URL', searchUrl);
    axios.get(searchUrl)
    .then(resData => {
        let formattedRecipeData = resData.data.meals.map(element => new BaseRecipe(element));
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

