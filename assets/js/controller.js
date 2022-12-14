import * as model from './model.js';
import recipeView from './views/recipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_TIME } from './config.js';
import sortResultView from './views/sortResultView.js';
import addToCartView from './views/addToCartView.js';

if (module.hot) {
  module.hot.accept;
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    // Load Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // Render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderSpinner();
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResult(query);
    // console.log(model.state.search.results);

    // Render Search Results
    console.log(model.getSearchResultsPage());

    resultsView.render(model.getSearchResultsPage());
    sortResultView.render(model.state.search);

    //Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderSpinner();
    resultsView.renderError();
  }
};

const controlSorting = function () {
  // sortResultView.update(model.state.search);
  resultsView.update(model.getSortedResult());
};

const controlPagination = function (GoPageNum) {
  resultsView.render(model.getSearchResultsPage(GoPageNum));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings
  model.updateServings(newServings);

  // Update the Recipe View
  recipeView.update(model.state.recipe);
  //
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Parent Element
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  controlBookmarks();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render new recipe
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.renderMessage();
    // addRecipeView.render();

    // Close Modal
    setTimeout(() => addRecipeView._toggleWindow(), MODAL_CLOSE_TIME * 1000);

    // Render to bookmark View
    controlBookmarks();
  } catch (err) {
    console.error('fire', err);
    addRecipeView.renderError(err.message);
  }
};
const controlCart = function () {
  addToCartView.render(model.state.cart);
};

const controlAddToCart = async function (id) {
  model.state.recipe.ingredients.filter((ing) => {
    if (ing.id === +id) {
      if (ing.cartedStatus) return;
      model.cartIngredient(ing);
      ing.cartedStatus = true;
      controlCart();
      console.log(model.state.cart);
      return ing;
    }
  });
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerAddToCart(controlAddToCart);
  searchView.addHandlerSearch(controlSearchResults);
  sortResultView.addHandlerSort(controlSorting);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
