import View from './view.js';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class CartView extends View {
  _parentEl = document.querySelector('.cart__list');
  _errorMessage =
    'No ingredient added to cart yet. Find a nice recipe and add its ingredients :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // const id = window.location.hash.slice(1);
    return this._data
      .map((ing) => {
        return `
        <li class="carted__ingredient">
            <div class="CartIng__quantity">${
              ing?.quantity ? new Fraction(ing.quantity).toString() : ''
            }</div>
            <div class="CartIng__description">
            <span class="CartIng__unit">${ing?.unit}</span>
            ${ing?.description}
            </div>
            <button class="btn--remove">Remove</button>
        </li>

        <style>
        .carted__ingredient{
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          padding: 1.5rem 3.25rem;
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
          border-right: 1px solid #fff;
          text-decoration: none;
          font-size: 16px;
        }
        .carted__ingredient:hover {
          background-color: #f9f5f3;
          -webkit-transform: translateY(-2px);
          transform: translateY(-2px);
        }

        .btn--remove{
          padding: inherit !important;
          color: #f48982;
          top: 0.5rem;
          right: 1.6rem;
          font-size: 1.5rem;
          cursor: pointer;
          border: none;
          background: none;
        }
        
        </style>
    `;
      })
      .join('');
  }
}

export default new CartView();
