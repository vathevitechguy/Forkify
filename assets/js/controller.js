import * as model from './model.js';
import recipeView from './views/recipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Load Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // Render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderSpinner();
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    await model.loadSearchResult('pizza');
    console.log(model.state.search.results);
  } catch (err) {
    recipeView.renderSpinner();
    recipeView.renderError();
  }
};
controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
