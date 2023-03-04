'use strict';

const mongoose = require('mongoose');
const Ingredient = require('./models/ingredient');
require('dotenv').config();

// starting mongoDB connection to atlas
mongoose.connect(process.env.MONGODB_URL);

// bringing in model
const Book = require('./models/ingredient');

// function seeds data into the database
async function seed(req, res, next) {
  const testIngredient = new Ingredient({
    name: 'Chicken',
    apiParamName: 'chicken',
    description: `The chicken is a type of domesticated fowl, a subspecies of the red junglefowl (Gallus gallus). It is one of the most common and widespread domestic animals, with a total population of more than 19 billion as of 2011. There are more chickens in the world than any other bird or domesticated fowl. Humans keep chickens primarily as a source of food (consuming both their meat and eggs) and, less commonly, as pets. Originally raised for cockfighting or for special ceremonies, chickens were not kept for food until the Hellenistic period (4th–2nd centuries BC). Genetic studies have pointed to multiple maternal origins in South Asia, Southeast Asia, and East Asia, but with the clade found in the Americas, Europe, the Middle East and Africa originating in the Indian subcontinent. From ancient India, the domesticated chicken spread to Lydia in western Asia Minor, and to Greece by the 5th century BC. Fowl had been known in Egypt since the mid-15th century BC, with the "bird that gives birth every day" having come to Egypt from the land between Syria and Shinar, Babylonia, according to the annals of Thutmose III.`,
    imageUrl: 'www.themealdb.com/images/ingredients/Chicken.png',
    quantity: 1,
    unit: 'lb',
    email: 'howdy@partner.com'
  });

  await testIngredient.save()
    .then(response => console.log('Saved East of Eden to database'))
    .catch(err => next(err));
}
seed();
