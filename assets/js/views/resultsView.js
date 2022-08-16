import View from './view.js';
import icons from 'url:../../img/icons.svg';
import preView from './preView.js';

class SearchResults extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    const data = this._data
      .map((result) => preView.render(result, false))
      .join('');

    return data;
  }
}

export default new SearchResults();
