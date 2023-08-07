// ==UserScript==
// @name         Draggable Scroll Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Does what it says on the tin.
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Constants

  /** @type {number} */
  const SCROLL_BY_AMOUNT_Y = 6;

  /** @type {number} */
  const INTERVAL_POLL_FREQ = 0;

  /** @type {number} */
  const INIT_POLL_INTERVAL = 5000;

  /** @type {string} */
  const BTN_ID = "gd-draggable-scroll";

  const main = () => {
    // Creating elements

    /** @type {HTMLBodyElement | null} */
    const body = document.querySelector("body");

    /** @type {HTMLDivElement | null} */
    const draggableScrollBtn = document.createElement("div");

    draggableScrollBtn.id = BTN_ID;

    // Styles

    draggableScrollBtn.textContent = "Scroll";
    draggableScrollBtn.style.position = "fixed";
    draggableScrollBtn.style.top = "0";
    draggableScrollBtn.style.left = "0";
    draggableScrollBtn.style.width = "125px";
    draggableScrollBtn.style.height = "125px";
    draggableScrollBtn.style.opacity = ".25";
    draggableScrollBtn.style.zIndex = "9999999999999999999999999999999999999999999999999999999999999";
    draggableScrollBtn.style.backgroundColor = "#F8F8F8";
    draggableScrollBtn.style.border = "1px solid black";
    draggableScrollBtn.style.display = "flex";
    draggableScrollBtn.style.alignItems = "center";
    draggableScrollBtn.style.justifyContent = "center";

    // Last saved position

    /**
     * @param {number} top
     * @param {number} left
     */
    const saveButtonPosition = (top, left) => {
      localStorage.setItem("gdDraggableScrollBtnTop", top.toString());
      localStorage.setItem("gdDraggableScrollBtnLeft", left.toString());
    };

    /**
     * @returns {{top: string | null, left: string | null}}
     */
    const getButtonPosition = () => {
      const top = localStorage.getItem("gdDraggableScrollBtnTop");
      const left = localStorage.getItem("gdDraggableScrollBtnLeft");

      return { top, left };
    };

    const savedPosition = getButtonPosition();

    if (savedPosition.top && savedPosition.left) {
      draggableScrollBtn.style.top = savedPosition.top + "px";
      draggableScrollBtn.style.left = savedPosition.left + "px";
    }

    body?.appendChild(draggableScrollBtn);

    // Add scroll listeners

    /** @type {number} */
    let t;

    /** @param {TouchEvent} e */
    const startScroll = (e) => {
      e.preventDefault();

      t = setInterval(() => window.scrollBy(0, SCROLL_BY_AMOUNT_Y), INTERVAL_POLL_FREQ);
    };

    /** @param {TouchEvent} e */
    const endScroll = (e) => {
      e.preventDefault();

      clearInterval(t);
    };

    draggableScrollBtn.addEventListener("touchstart", startScroll);
    draggableScrollBtn.addEventListener("touchend", endScroll);

    // Add drag listeners

    /** @type {number} */
    let x = 0;

    /** @type {number} */
    let y = 0;

    /** @type {boolean} */
    let isDragging = false;

    /**
     * @param {TouchEvent} e
     */
    const touchStartHandler = (e) => {
      x = e.touches[0].clientX - draggableScrollBtn.offsetLeft;
      y = e.touches[0].clientY - draggableScrollBtn.offsetTop;

      isDragging = true;

      document.addEventListener("touchmove", touchMoveHandler);
      document.addEventListener("touchend", touchEndHandler);
    };

    /**
     * @param {TouchEvent} e
     */
    const touchMoveHandler = (e) => {
      if (!isDragging) return;

      const newLeft = e.touches[0].clientX - x;
      const newTop = e.touches[0].clientY - y;

      const draggableWidth = draggableScrollBtn.offsetWidth;
      const draggableHeight = draggableScrollBtn.offsetHeight;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Ensure the element stays within the bounds of the screen
      const maxX = viewportWidth - draggableWidth;
      const maxY = viewportHeight - draggableHeight;

      const constrainedTop = Math.max(0, Math.min(newTop, maxY));
      const constrainedLeft = Math.max(0, Math.min(newLeft, maxX));

      draggableScrollBtn.style.top = `${constrainedTop}px`;
      draggableScrollBtn.style.left = `${constrainedLeft}px`;

      saveButtonPosition(constrainedTop, constrainedLeft);
    };

    /**
     * @returns {void}
     */
    const touchEndHandler = () => {
      isDragging = false;

      document.removeEventListener("touchmove", touchMoveHandler);
      document.removeEventListener("touchend", touchEndHandler);
    };

    draggableScrollBtn.addEventListener("touchstart", touchStartHandler);

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        e.preventDefault();
      },
      { passive: false }
    );
  };

  main();

  // window.setInterval(() => {
  //   const button = document.getElementById(BTN_ID);

  //   if (!button) {
  //     main();
  //   }
  // }, INIT_POLL_INTERVAL);
})();
