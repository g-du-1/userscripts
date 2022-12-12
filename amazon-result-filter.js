// ==UserScript==
// @name         Amazon Result Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides search results that have fewer reviews than the limit specified.
// @author       Gergo Dudaszeg
// @match        https://www.amazon.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.uk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const filterResults = (reviewLimit, resultElemSelector, numOfReviewsElemSelector) => {
        const searchResults = document.querySelectorAll(resultElemSelector);
        if (searchResults.length < 1) return;

        searchResults.forEach((result) => {
            const numOfReviewsElem = result.querySelector(numOfReviewsElemSelector);

            if (numOfReviewsElem && numOfReviewsElem.textContent) {
                const numOfReviews = parseInt(numOfReviewsElem.textContent.replace(/[(),]/g, ''));
                if (numOfReviews < reviewLimit) result.style.display = 'none';
            }
        });
    }

    setInterval(() => {
        filterResults(500, '.s-card-container', '.a-link-normal .a-size-base:not(.a-text-bold)')
    }, 1000);

})();
