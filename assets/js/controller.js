import * as model from './model.js';
import recipeView from './views/recipeViews.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept;
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    // console.log(model.state.search.results);

    // Render Search Results
    console.log(model.getSearchResultsPage());
    resultsView.render(model.getSearchResultsPage());

    //Render Pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderSpinner();
    resultsView.renderError();
  }
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

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
