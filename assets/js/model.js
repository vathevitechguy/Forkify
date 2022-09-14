import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULT_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

// #630e21405a1b010016058ea4
// #62f5b3145fdbe8001679d56d
// #5ed6604591c37cdc054bccf9
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    sortStatus: Boolean,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
  cart: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);

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

export const getSortedResult = function () {
  if (state.search.sortStatus) {
    const sorter = getSearchResultsPage().sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;

      return 0;
    });

    state.search.sortStatus = false;
    return sorter;
  } else {
    const sorter = getSearchResultsPage().sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();
      if (titleA < titleB) return 1;
      if (titleA > titleB) return -1;

      return 0;
    });

    state.search.sortStatus = true;
    return sorter;
  }
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};
const saveCartLocally = function () {
  localStorage.setItem('Cart', JSON.stringify(state.cart));
};

export const cartIngredient = function (ingredient) {
  state.cart.push(ingredient);
  saveCartLocally();
};
const getCartItems = (function () {
  const cartData = JSON.parse(localStorage.getItem('Cart'));

  if (!cartData) return;

  state.cart = cartData;
})();

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

export const uploadRecipe = async function (newRecipe) {
  try {
    let ingredientsArr = [];
    for (let index = 1; index < 6; index++) {
      const ingredientsGrp = Object.entries(newRecipe)
        .filter(
          (entry, i = 6) =>
            entry[0].startsWith(`ingredient-${index}`) && entry[1] !== ''
        )
        .map((ing, i) => {
          const ingGrp = ing[1]
            .split(',')
            .map((el) => el.trim())
            .reduce((prev, cur) => [...prev, cur]);

          return ingGrp;
        });

      if (!ingredientsGrp.length) break;
      console.log(ingredientsGrp);
      const [quantity, unit, description] = ingredientsGrp;
      const ingredients = {
        quantity: quantity ? +quantity : null,
        unit,
        description,
      };

      ingredientsArr = [...ingredientsArr, ingredients];
    }

    console.log(ingredientsArr);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: ingredientsArr,
    };
    console.log(recipe);

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
