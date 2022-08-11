import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    if (
      state.bookmarks.some(
        (bookmarkedReci) => bookmarkedReci.id === state.recipe.id
      )
    )
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const saveBookmarksLocally = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Save bookmarks to local Storage
  saveBookmarksLocally();
};

export const deleteBookmark = function (id) {
  /* const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  console.log(state.bookmarks, 'Deleted'); */

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  state.bookmarks.some((bookReci, i) => {
    if (id === bookReci.id) {
      state.bookmarks.splice(i, 1);
      bookReci.bookmarked = false;
    }
  });

  // Save bookmarks to local Storage
  saveBookmarksLocally();
};

const getBookmarks = (function () {
  const bookmarksData = JSON.parse(localStorage.getItem('Bookmarks'));

  if (!bookmarksData) return;

  state.bookmarks = bookmarksData;
})();

const clearBookmarks = function () {
  localStorage.clear('Bookmarks');
};
clearBookmarks();
