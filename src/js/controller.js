import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// CONTROL RECIPE
/////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) UPDATE RESULTS TO VIEW MARK SELECTED SEARCH RESULT
    resultsView.update(model.loadSearchResultsPage())

    // 2) UPDATING BOOKMARKS
    bookmarksView.update(model.state.bookmarks);

    // 3) LOADING RECIPE
    await model.loadRecipe(id);

    // 4) RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError()
  }
};

// SEARCH
/////////

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1) GET SEARCH QUERY
    const query = searchView.getQuery();
    if(!query) return;

    // 2) LOAD SEARCH QUERY
    await model.loadSearchResults(query);

    // 3) RENDER RESULTS
    resultsView.render(model.loadSearchResultsPage());

    // 4) RENDER INITIAL PAGINATION BUTTONS
    paginationView.render(model.state.search);
  } catch(err) {
    console.log(err);
  }
};

// PAGINATION
/////////////

const controlPagination = function(goToPage) {
  // 1) RENDER NEW RESULTS
  resultsView.render(model.loadSearchResultsPage(goToPage));

  // 2) RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

// SERVINGS
///////////

const controlServings = function(newServings) {
  // UPDATE RECIPE SERVINGS
  model.loadServings(newServings);

  // UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);
};

// BOOKMARKS
////////////

const controlAddBookmark = function() {
  // 1) ADD/REMOVE BOOKMARK
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else
    model.removeBookmark(model.state.recipe.id);
  
  // 2) UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // 3) RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

// ADD RECIPE
/////////////

const controlAddRecipe = async function (newRecipe) {
  try {
      // SHOW LOADING SPINNER
      addRecipeView.renderSpinner();

      // UPLOAD NEW RECIPE DATA
      await model.uploadRecipe(newRecipe);
      console.log(model.state.recipe);

      // RENDER RECIPE
      recipeView.render(model.state.recipe);

      // SUCCESS MESSAGE
      addRecipeView.renderSuccess();

      // RENDER BOOKMARKS
      bookmarksView.render(model.state.bookmarks);

      // CHANGE ID IN URL
      window.history.pushState(null, '', `#${model.state.recipe.id}`);

      // CLOSE FORM WINDOW
      setTimeout(function() {
        addRecipeView.toggleWindow()
      }, MODAL_CLOSE_SEC * 1000);
  } catch(err) {
      console.error(err);
      addRecipeView.renderError(err.message);
  }
};

// INITIALIZATION
/////////////////

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();