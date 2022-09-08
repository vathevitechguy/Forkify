import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class CartView extends View {
  _parentEl = document.querySelector('.cart__list');
  _errorMessage =
    'No ingredient added yet. Find a nice recipe and add its ingredients :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map((ing, i) => {
        return `
        <li class="recipe__ingredient">
            <div class="recipe__quantity">${
              ing[i]?.quantity ? new Fraction(ing[i].quantity).toString() : ''
            }</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ing[i]?.unit}</span>
            ${ing[i]?.description}
            </div>
        </li>
    `;
      })
      .join('');
  }
}

export default new CartView();
