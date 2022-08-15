import View from './view.js';
import icons from 'url:../../img/icons.svg';
import preView from './preView.js';

class SearchResults extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    const sortMarkup = `
      <button class="btn--sort"><span style="color: #f48982; font-size: 18px;">↓</span> SORT</button>
      <style>.btn--sort {
        margin-left: auto;
        border: none;
        background: none;
        font-size: 1.4rem;
        font-weight: 500;
        cursor: pointer;
        float: right;
        margin-right: 20px;
        margin-bottom: 25px !important;
      }</style>
    `;
    const data = `
      ${sortMarkup} ${this._data
      .map((result) => preView.render(result, false))
      .join('')}
      `;

    return data;
  }
}

export default new SearchResults();
