// Function to check if an element is in the viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to get elements in the middle of the viewport
function getElementsInMiddle() {
    const viewportMidpointY = window.innerHeight / 2;
    const elementsAtMidpoint = document.elementsFromPoint(window.innerWidth / 2, viewportMidpointY);
    return elementsAtMidpoint;
}

// Function to capture visible text in the middle of the viewport
function captureVisibleText() {
    const elementsInMiddle = getElementsInMiddle();
    const visibleText = Array.from(elementsInMiddle).reduce((text, element) => {
        if (isElementInViewport(element)) {
            text += element.textContent.trim() + ' ';
        }
        return text;
    }, '');
    const currentURL = window.location.href;

    return {
        visibleText,
        currentURL,
    };
}

// Function to save visible text to localStorage
function saveVisibleTextToLocalStorage() {
    const capturedData = captureVisibleText();
    localStorage.setItem('capturedData', JSON.stringify(capturedData));
}

// Call the function when needed (e.g., on page load or a specific event)
saveVisibleTextToLocalStorage();
