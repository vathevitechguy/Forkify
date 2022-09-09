import { RENDER_FORM_TIME } from '../config.js';
import View from './view.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _message = 'Recipe was successfully added :)';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    // this.addHandlerUpload();
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }
  renderForm() {
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }
  execute() {
    this._toggleWindow();
    setTimeout(() => this.renderForm(), RENDER_FORM_TIME * 1000);
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.execute.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr); // Converting Array to object
      // console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {
    return `
    <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              value="13"
              type="text"
              name="ingredient-1-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              value="33"
              type="text"
              name="ingredient-1-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              value="444"
              type="text"
              name="ingredient-1-desc"
              placeholder="Description"
            />
          </div>

          <label>Ingredient 2</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              type="text"
              name="ingredient-2-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              type="text"
              name="ingredient-2-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              type="text"
              name="ingredient-2-desc"
              placeholder="Description"
            />
          </div>

          <label>Ingredient 3</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              type="text"
              name="ingredient-3-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              type="text"
              name="ingredient-3-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              type="text"
              name="ingredient-3-desc"
              placeholder="Description"
            />
          </div>

          <label>Ingredient 4</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              type="text"
              name="ingredient-4-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              type="text"
              name="ingredient-4-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              type="text"
              name="ingredient-4-desc"
              placeholder="Description"
            />
          </div>

          <label>Ingredient 5</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              type="text"
              name="ingredient-5-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              type="text"
              name="ingredient-5-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              type="text"
              name="ingredient-5-desc"
              placeholder="Description"
            />
          </div>

          <label>Ingredient 6</label>
          <div class="ingredient--inputs">
            <input
              class="ing"
              type="text"
              name="ingredient-6-quantity"
              placeholder="Quantity"
            />
            <input
              class="ing"
              type="text"
              name="ingredient-6-unit"
              placeholder="Unit"
            />
            <input
              class="ingDes"
              type="text"
              name="ingredient-6-desc"
              placeholder="Description"
            />
          </div>
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="assets/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;
  }
}

export default new AddRecipeView();
