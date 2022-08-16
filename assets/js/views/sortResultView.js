import View from './view.js';

class sortResultView extends View {
  _parentEl = document.querySelector('.sort');

  addHandlerSort(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const sortbtn = e.target.classList.contains('btn--sort');

      if (!sortbtn) return;

      handler();
    });
  }

  _generateMarkup() {
    const data = this._data;
    const sortMarkup = `
      <center><button class="btn--sort"><span style="color: #f48982; font-size: 18px;">↓</span> SORT ${
        data ? `A-Z` : `Z-A`
      }</button></center>
      <style>.btn--sort {
        margin-left: auto;
        border: none;
        background: none;
        font-size: 1.4rem;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 15px !important;
      }</style>
    `;
    return sortMarkup;
  }
}

export default new sortResultView();
