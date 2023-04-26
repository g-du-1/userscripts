// ==UserScript==
// @name         Reddit UX Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get rid of annoying Reddit UX.
// @author       You
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const checkVisible = (elm) => {
        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    const unfuckUI = () => {
        console.log('Unfucking UI...')

        // LISTING

        const html = document.querySelector('html');
        html.classList.remove('scroll-disabled');
        const body = document.querySelector('body');
        body.classList.remove('scroll-disabled');

        const iframes = document.querySelectorAll('iframe')

        Array.from(iframes).forEach(node => {
           if (node.src.includes('sso')) {
               node.style.display = 'none';
           }
        });

        const continueBtn = document.querySelector('button.XPromoPopupRpl__actionButton');
        if (continueBtn) continueBtn.click();

        const bottomBar = document.querySelector('.XPromoBottomBar');
        if (bottomBar) bottomBar.style.display = 'none';

        const useAppBtn = document.querySelector('.TopNav__useAppButton');
        if (useAppBtn) useAppBtn.style.display = 'none';

        const cookieClose = document.querySelector('.EUCookieNotice__close');
        if (cookieClose) cookieClose.click();

        // POST PAGE

        // Top Cookies
        const topCookies = document.querySelector("reddit-cookie-banner")?.shadowRoot.querySelector("#reject-nonessential-cookies-button > button")
        if (topCookies) topCookies.click()

        // Oauth Modal
        const oauthModal = document.querySelector('#credential_picker_iframe');
        if (oauthModal) oauthModal.style.display = 'none';

        const allAsyncLoaders = document.querySelectorAll('shreddit-async-loader');

        // Top Use App Btn
        Array.from(allAsyncLoaders).forEach(node => {
           if (node.paintGroup === 'xpromo' && node.bundleName === 'top_button') {
               node.style.display = 'none';
           }
        });

        // Bottom Promo Bar
        const botPromoBar = Array.from(allAsyncLoaders).find(node => node.bundleName === 'bottom_bar_xpromo');
        if (botPromoBar) botPromoBar.style.display = 'none';

        // Bottom Continue
        // const botContinue = document.querySelector("body > shreddit-app > shreddit-experience-tree").shadowRoot.querySelector("div > shreddit-async-loader").shadowRoot.querySelector("xpromo-app-selector")?.shadowRoot.querySelector("#secondary-button")
        // if (botContinue) botContinue.click()

        // Load More Comments
        const allFacePlatePartials = document.querySelectorAll('faceplate-partial');

        Array.from(allFacePlatePartials).forEach(node => {
           if (node.method === 'post' && node.src.includes('top-level=1') && checkVisible(node)) {
               node.click()
           }
        });
    }

    document.addEventListener('touchstart', unfuckUI)
    document.addEventListener('keydown', unfuckUI)
})();
