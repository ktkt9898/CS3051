let scrollInterval;
let speedTimeout;

function toggleIframeAndButtons(iframeId, containerId, button) {
    const iframe = document.getElementById(iframeId);
    const container = document.getElementById(containerId);
    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        container.style.display = "block";
        button.textContent = "Hide";
    } else {
        iframe.style.display = "none";
        container.style.display = "none";
        button.textContent = "Show";
    }
}

// Scroll function without tempo change in song
function startScrolling(iframeId, initialScrollSpeed, intervalTime) {
    stopScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
    let scrollSpeed = initialScrollSpeed;

    // Set the interval for scrolling
    scrollInterval = setInterval(() => {
        scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
    }, intervalTime); // Set the interval time to control the refresh rate
}

// Scroll function for tempo change in song
function startScrolling(iframeId, initialScrollSpeed, intervalTime, speedChangeTime = 10000, newScrollSpeed = 7) {
    stopScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
    let scrollSpeed = initialScrollSpeed;

    // Set the interval for scrolling
    scrollInterval = setInterval(() => {
        scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
    }, intervalTime); // Set the interval time to control the refresh rate

    // Change the scroll speed after a specified time
    speedTimeout = setTimeout(() => {
        scrollSpeed = newScrollSpeed; // Update the scroll speed
    }, speedChangeTime); // Time in milliseconds after which the scroll speed changes
}

function stopScrolling() {
    clearInterval(scrollInterval);
    clearTimeout(speedTimeout); // Reset the speed timeout
}

function restartScrolling(iframeId) {
    stopScrolling(); // Stop any ongoing scrolling
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
    iframeDocument.body.scrollTop = 0; // Scroll to the top
}