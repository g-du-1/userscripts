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

(function () {
    ("use strict");

    const removeScrollDisabled = () => {
        document.body.classList.remove("scroll-disabled");

        console.assert(
            !document.body.classList.contains("scroll-disabled"),
            "scroll-disabled class is not present on the body"
        );
    };

    const findNsfwBlocker = (allAsyncLoaders) => {
        return Array.from(allAsyncLoaders).find((node) => node.bundleName === "nsfw_blocking_modal");
    };

    const removeNsfwBlur = () => {
        const sidebarGrid = document.querySelector(".sidebar-grid");

        if (!sidebarGrid) return;

        sidebarGrid.style.filter = "none";

        console.assert(sidebarGrid.style.filter === "none", "Sidebar grid filter is none");
    };

    const removeNsfwImgBlocker = () => {
        const imgBlockWrap = document.querySelector("xpromo-nsfw-blocking-container");

        if (!imgBlockWrap) return;

        const shadowRoot = imgBlockWrap.shadowRoot;

        if (!shadowRoot) return;

        const prompt = shadowRoot.querySelector(".prompt");

        if (!prompt) return;

        prompt.remove();

        console.assert(!shadowRoot.querySelector(".prompt"), "Prompt is not present");
    };

    const removeNsfwScrollPrevention = () => {
        document.body.style.pointerEvents = "unset";
        document.body.style.overflow = "unset";

        console.assert(document.body.style.pointerEvents === "unset", "Body Pointer Events is unset");
        console.assert(document.body.style.overflow === "unset", "Body Overflow is unset");
    };

    const removeNsfwUseAppModal = (allAsyncLoaders) => {
        const origNsfwBlocker = findNsfwBlocker(allAsyncLoaders);

        if (!origNsfwBlocker) return;

        origNsfwBlocker.remove();

        const modifiedLoaders = getAllAsyncLoaders();
        const currNsfwBlocker = findNsfwBlocker(modifiedLoaders);

        console.assert(!currNsfwBlocker, "NSFW blocker was removed from the document");
    };

    const disableNsfwBlocking = (allAsyncLoaders) => {
        removeNsfwScrollPrevention();
        removeNsfwUseAppModal(allAsyncLoaders);
        removeNsfwBlur();
        removeNsfwImgBlocker();
    };

    const clickContinueInBrowser = () => {
        const continueInBrowserSelector = "button.XPromoPopupRpl__actionButton";
        const continueBtn = document.querySelector(continueInBrowserSelector);

        if (continueBtn) {
            continueBtn.click();

            console.assert(
                !document.querySelector(continueInBrowserSelector),
                "Continue in browser button is not present"
            );
        }
    };

    const hideBottomBar = () => {
        const bottomBar = document.querySelector(".XPromoBottomBar");

        if (bottomBar) {
            bottomBar.style.display = "none";

            console.assert(bottomBar.style.display === "none", "Bottom bar is hidden");
        }
    };

    const hideTopAppBtn = () => {
        const selectors = [".TopNav__promoButton", ".TopNav__useAppButton"];

        selectors.forEach((selector) => {
            const button = document.querySelector(selector);

            if (button) {
                button.style.display = "none";

                console.assert(button.style.display === "none", "Use app button is hidden");
            }
        });
    };

    const closeCookieNotice = () => {
        const cookieNoticeSelector = ".EUCookieNotice__close";
        const cookieClose = document.querySelector(cookieNoticeSelector);

        if (cookieClose) {
            cookieClose.click();

            console.assert(!document.querySelector(cookieNoticeSelector), "Close cookie notice button is not present");
        }
    };

    const hideSsoIframe = () => {
        const iframes = document.querySelectorAll("iframe");

        Array.from(iframes).forEach((node) => {
            if (node.src.includes("sso")) {
                node.style.display = "none";

                console.assert(node.style.display === "none", "SSO iframe is hidden");
            }
        });
    };

    const clickCookieBanner = () => {
        const cookieBanner = document.querySelector("reddit-cookie-banner");

        if (!cookieBanner) return;

        const shadowRoot = cookieBanner.shadowRoot;

        if (!shadowRoot) return;

        const rejectBtnSelector = "#reject-nonessential-cookies-button > button";

        const rejectBtn = shadowRoot.querySelector(rejectBtnSelector);

        if (!rejectBtn) return;

        rejectBtn.click();

        console.assert(!shadowRoot.querySelector(rejectBtnSelector), "Cookie banner is not present");
    };

    const hideOauthModal = () => {
        const oauthModal = document.querySelector("#credential_picker_iframe");

        if (!oauthModal) return;

        oauthModal.style.display = "none";

        console.assert(oauthModal.style.display === "none", "Oauth modal is hidden");
    };

    const hidePostAppBtn = (allAsyncLoaders) => {
        Array.from(allAsyncLoaders).forEach((node) => {
            if (node.paintGroup === "xpromo" && node.bundleName === "top_button") {
                node.style.display = "none";

                console.assert(node.style.display === "none", "Post app button is hidden");
            }
        });
    };

    const hideBottomPromoBar = (allAsyncLoaders) => {
        const botPromoBar = Array.from(allAsyncLoaders).find((node) => node.bundleName === "bottom_bar_xpromo");

        if (botPromoBar) {
            botPromoBar.style.display = "none";

            console.assert(botPromoBar.style.display === "none", "Bottom promo bar is hidden");
        }
    };

    const clickMoreComments = (allFacePlatePartials) => {
        Array.from(allFacePlatePartials).forEach((node) => {
            if (node.method === "post" && node.src.includes("top-level=1") && checkVisible(node)) {
                node.click();

                // TODO: Assert
            }
        });
    };

    const getAllAsyncLoaders = () => {
        return document.querySelectorAll("shreddit-async-loader");
    };

    const getAllFacePlatePartials = () => {
        return document.querySelectorAll("faceplate-partial");
    };

    const checkVisible = (elm) => {
        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    };

    const unfuckUI = () => {
        console.log("Unfucking UI...");

        // Listing

        removeScrollDisabled();
        clickContinueInBrowser();
        hideBottomBar();
        hideTopAppBtn();
        closeCookieNotice();
        hideSsoIframe();

        // Post Page

        clickCookieBanner();
        hideOauthModal();

        const allAsyncLoaders = getAllAsyncLoaders();

        hidePostAppBtn(allAsyncLoaders);
        hideBottomPromoBar(allAsyncLoaders);
        disableNsfwBlocking(allAsyncLoaders);

        const allFacePlatePartials = getAllFacePlatePartials();

        clickMoreComments(allFacePlatePartials);
    };

    window.addEventListener("load", unfuckUI);
    window.addEventListener("DOMContentLoaded", unfuckUI);
    document.addEventListener("touchstart", unfuckUI);
    document.addEventListener("keydown", unfuckUI);
    document.addEventListener("input", unfuckUI);
})();
