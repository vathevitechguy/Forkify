import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULT_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

// #630e21405a1b010016058ea4
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
    const testing = Object.entries(newRecipe)
      .filter((entry, i) => {
        const filterData = (entry) => {
          const ingtest = entry[1].split(',').map((el) => el.trim());

          console.log(ingtest);
          return ingtest;
        };

        const ing1 =
          entry[0].startsWith(`ingredient-1`) && entry[1] !== ''
            ? filterData(entry)
            : '';

        const ing2 =
          entry[0].startsWith(`ingredient-2`) && entry[1] !== ''
            ? filterData(entry)
            : '';

        return [[ing1], [ing2]];

        // if (entry[0].startsWith(`ingredient-1`) && entry[1] !== '') {

        // }
        // if (entry[0].startsWith(`ingredient-2`) && entry[1] !== '') {
        //   console.log('Ingreient 2 Present ' + i);
        //   const ing2 = entry[1]
        //     .split(',')
        //     .map((el) => el.trim())
        //     .reduce((prev, cur) => prev.concat(cur));
        //   return ing2;
        // }
      })
      .reduce((prev, cur) => {
        return prev.concat(cur);
      })
      .filter((el) => !el.startsWith(`ingredient`));

    console.log(testing);

    /*const ingredientsGrp = Object.entries(newRecipe)
      .filter(
        (entry, i) => entry[0].startsWith(`ingredient-1`) && entry[1] !== ''
      )
      .map((ing, i) => {
        const ingGrp = ing[1]
          .split(',')
          .map((el) => el.trim())
          .reduce((prev, cur) => prev.concat(cur));

        return ingGrp;
      });

    console.log(ingredientsGrp);

    const [quantity, unit, description] = ingredientsGrp;
    const ingredients = {
      quantity: quantity ? +quantity : null,
      unit,
      description,
    };*/

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
