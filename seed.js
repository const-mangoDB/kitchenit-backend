'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Ingredient = require('./models/ingredient');
const Recipe = require('./models/recipe');
require('dotenv').config();

// starting mongoDB connection to atlas
mongoose.connect(process.env.MONGODB_URL);

// function seeds data into the database using MVP Schema
async function seed(req, res, next) {
  const testIngredient = new Ingredient({
    name: 'Chicken',
    description: `The chicken is a type of domesticated fowl, a subspecies of the red junglefowl (Gallus gallus). It is one of the most common and widespread domestic animals, with a total population of more than 19 billion as of 2011. There are more chickens in the world than any other bird or domesticated fowl. Humans keep chickens primarily as a source of food (consuming both their meat and eggs) and, less commonly, as pets. Originally raised for cockfighting or for special ceremonies, chickens were not kept for food until the Hellenistic period (4th–2nd centuries BC). Genetic studies have pointed to multiple maternal origins in South Asia, Southeast Asia, and East Asia, but with the clade found in the Americas, Europe, the Middle East and Africa originating in the Indian subcontinent. From ancient India, the domesticated chicken spread to Lydia in western Asia Minor, and to Greece by the 5th century BC. Fowl had been known in Egypt since the mid-15th century BC, with the "bird that gives birth every day" having come to Egypt from the land between Syria and Shinar, Babylonia, according to the annals of Thutmose III.`,
    imageUrl: 'www.themealdb.com/images/ingredients/Chicken.png',
    email: 'howdy@partner.com'
  });

  const testRecipe = new Recipe({
    'name': 'Battenberg Cake',
    'apiId': '52894',
    'imageUrl': 'https://www.themealdb.com/images/media/meals/ywwrsp1511720277.jpg',
    'category': 'British',
    'instructions': [
      'Heat oven to 180C/160C fan/gas 4 and line the base and sides of a 20cm square tin with baking parchment (the easiest way is to cross 2 x 20cm-long strips over the base). To make the almond sponge, put the butter, sugar, flour, ground almonds, baking powder, eggs, vanilla and almond extract in a large bowl. Beat with an electric whisk until the mix comes together smoothly. Scrape into the tin, spreading to the corners, and bake for 25-30 mins – when you poke in a skewer, it should come out clean. Cool in the tin for 10 mins, then transfer to a wire rack to finish cooling while you make the second sponge.',
      'For the pink sponge, line the tin as above. Mix all the ingredients together as above, but don’t add the almond extract. Fold in some pink food colouring. Then scrape it all into the tin and bake as before. Cool.',
      'To assemble, heat the jam in a small pan until runny, then sieve. Barely trim two opposite edges from the almond sponge, then well trim a third edge. Roughly measure the height of the sponge, then cutting from the well-trimmed edge, use a ruler to help you cut 4 slices each the same width as the sponge height. Discard or nibble leftover sponge. Repeat with pink cake.',
      'Take 2 x almond slices and 2 x pink slices and trim so they are all the same length. Roll out one marzipan block on a surface lightly dusted with icing sugar to just over 20cm wide, then keep rolling lengthways until the marzipan is roughly 0.5cm thick. Brush with apricot jam, then lay a pink and an almond slice side by side at one end of the marzipan, brushing jam in between to stick sponges, and leaving 4cm clear marzipan at the end. Brush more jam on top of the sponges, then sandwich remaining 2 slices on top, alternating colours to give a checkerboard effect. Trim the marzipan to the length of the cakes.',
      'Carefully lift up the marzipan and smooth over the cake with your hands, but leave a small marzipan fold along the bottom edge before you stick it to the first side. Trim opposite side to match size of fold, then crimp edges using fingers and thumb (or, more simply, press with prongs of fork). If you like, mark the 10 slices using the prongs of a fork.',
      'Assemble second Battenberg and keep in an airtight box or well wrapped in cling film for up to 3 days. Can be frozen for up to a month.'
    ],
    'ingredients': [
      {
        'ingredientName': 'Butter',
        'measurement': '175g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Butter.png'
      },
      {
        'ingredientName': 'Caster Sugar',
        'measurement': '175g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Caster%20Sugar.png'
      },
      {
        'ingredientName': 'Self-raising Flour',
        'measurement': '140g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Self-raising%20Flour.png'
      },
      {
        'ingredientName': 'Almonds',
        'measurement': '50g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Almonds.png'
      },
      {
        'ingredientName': 'Baking Powder',
        'measurement': '½ tsp',
        'imageUrl': 'https://themealdb.com/images/ingredients/Baking%20Powder.png'
      },
      {
        'ingredientName': 'Eggs',
        'measurement': '3 Medium',
        'imageUrl': 'https://themealdb.com/images/ingredients/Eggs.png'
      },
      {
        'ingredientName': 'Vanilla Extract',
        'measurement': '½ tsp',
        'imageUrl': 'https://themealdb.com/images/ingredients/Vanilla%20Extract.png'
      },
      {
        'ingredientName': 'Almond Extract',
        'measurement': '¼ teaspoon',
        'imageUrl': 'https://themealdb.com/images/ingredients/Almond%20Extract.png'
      },
      {
        'ingredientName': 'Butter',
        'measurement': '175g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Butter.png'
      },
      {
        'ingredientName': 'Caster Sugar',
        'measurement': '175g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Caster%20Sugar.png'
      },
      {
        'ingredientName': 'Self-raising Flour',
        'measurement': '140g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Self-raising%20Flour.png'
      },
      {
        'ingredientName': 'Almonds',
        'measurement': '50g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Almonds.png'
      },
      {
        'ingredientName': 'Baking Powder',
        'measurement': '½ tsp',
        'imageUrl': 'https://themealdb.com/images/ingredients/Baking%20Powder.png'
      },
      {
        'ingredientName': 'Eggs',
        'measurement': '3 Medium',
        'imageUrl': 'https://themealdb.com/images/ingredients/Eggs.png'
      },
      {
        'ingredientName': 'Vanilla Extract',
        'measurement': '½ tsp',
        'imageUrl': 'https://themealdb.com/images/ingredients/Vanilla%20Extract.png'
      },
      {
        'ingredientName': 'Almond Extract',
        'measurement': '¼ teaspoon',
        'imageUrl': 'https://themealdb.com/images/ingredients/Almond%20Extract.png'
      },
      {
        'ingredientName': 'Pink Food Colouring',
        'measurement': '½ tsp',
        'imageUrl': 'https://themealdb.com/images/ingredients/Pink%20Food%20Colouring.png'
      },
      {
        'ingredientName': 'Apricot',
        'measurement': '200g',
        'imageUrl': 'https://themealdb.com/images/ingredients/Apricot.png'
      },
      {
        'ingredientName': 'Marzipan',
        'measurement': '1kg',
        'imageUrl': 'https://themealdb.com/images/ingredients/Marzipan.png'
      },
      {
        'ingredientName': 'Icing Sugar',
        'measurement': 'Dusting',
        'imageUrl': 'https://themealdb.com/images/ingredients/Icing%20Sugar.png'
      },
    ],
    email: 'howdy@partner.com'
  });

  await testIngredient.save()
    .then(response => console.log('Saved Ingredient to database'))
    .catch(err => err.message);

  await testRecipe.save()
    .then(response => console.log('Saved Recipe to database'))
    .catch(err => console.log(err.message));
}

seed();
