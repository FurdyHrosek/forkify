import View from "./View";

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const goToPage = btn.dataset.goto;

            handler(goToPage);
        })
    }

    _generateMarkup() {
        const curPage = Number(this._data.page);
        const numPages = Number(Math.ceil(this._data.results.length / this._data.resultsPerPage));

        // PAGE 1 & OTHER PAGES
        if(curPage === 1 && numPages > 1) {
            return this._generatePageSwitch(1);
        }

        // LAST PAGE
        if(curPage === numPages && numPages > 1) {
            return this._generatePageSwitch(-1);
        }

        // OTHER PAGE
        if(curPage < numPages) {
            return this._generatePageSwitch(-1) + this._generatePageSwitch(1);
        }

        // PAGE 1 & NO OTHER PAGES
        return '';
    }

    _generatePageSwitch(num) {
        const curPage = Number(this._data.page);
        return `
        <button data-goto="${num + curPage}" class="btn--inline pagination__btn--${num > 0 ? 'next' : 'prev'}">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${num > 0 ? 'right' : 'left'}"></use>
            </svg>
            <span>Page ${num + curPage}</span>
        </button>
    `;}
}

export default new PaginationView();