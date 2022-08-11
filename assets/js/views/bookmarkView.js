import View from './view.js';
import icons from 'url:../../img/icons.svg';
import preView from './preView.js';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map((bookmark) => {
        return preView.render(bookmark, false);
      })
      .join('');
  }
}

export default new BookmarksView();
