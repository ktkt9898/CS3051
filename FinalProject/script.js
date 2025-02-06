let scrollInterval;
let speedTimeout;
let currentScrollPosition = 0;
let currentScrollSpeed = 0;

function toggleIframeAndButtons(iframeId, buttonContainerId, button) {
    const iframe = document.getElementById(iframeId);
    const buttonContainer = document.getElementById(buttonContainerId);
    const containerMusicTrack = button.closest('.containerMusicTrack'); // Get the closest guitarTab container

    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        buttonContainer.style.display = "flex";
        button.textContent = "Hide";
        buttonContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to the iframe smoothly
    } else {
        iframe.style.display = "none";
        buttonContainer.style.display = "none";
        button.textContent = "Show";
        containerMusicTrack.scrollIntoView({ behavior: 'smooth' }); // Scroll to the top of the guitarTab container smoothly
    }
}

// Scroll function without tempo change in song
function startScrolling(iframeId, initialScrollSpeed) {
    stopScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
    let scrollSpeed = initialScrollSpeed || currentScrollSpeed;

    // Enable the "Increase" button
    document.getElementById('increaseScrollSpeedButton').disabled = false;

    // Enable the "Decrease" button
    document.getElementById('decreaseScrollSpeedButton').disabled = false;

    // Set the interval for scrolling
    scrollInterval = setInterval(() => {
        scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
    }, 10); // Set the interval time to control the refresh rate
}

// function startScrollingWithTempoChange(iframeId, initialScrollSpeed, speedChangeTime = 10000, newScrollSpeed = 7) {
//     stopScrolling(); // Ensure any existing scrolling is stopped before starting a new one

//     const iframe = document.getElementById(iframeId);
//     const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//     let scrollPosition = currentScrollPosition || iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
//     let scrollSpeed = currentScrollSpeed || initialScrollSpeed;

//     // Set the interval for scrolling
//     scrollInterval = setInterval(() => {
//         scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
//         iframeDocument.documentElement.scrollTop = scrollPosition;
//         iframeDocument.body.scrollTop = scrollPosition;
//         currentScrollPosition = scrollPosition; // Update the current scroll position
//     }, 10); // Set the interval time to control the refresh rate

//     // Change the scroll speed after a specified time
//     speedTimeout = setTimeout(() => {
//         scrollSpeed = newScrollSpeed; // Update the scroll speed
//         currentScrollSpeed = newScrollSpeed; // Update the current scroll speed
//     }, speedChangeTime); // Time in milliseconds after which the scroll speed changes
// }

function stopScrolling() {
    clearInterval(scrollInterval);
    clearTimeout(speedTimeout);
}

document.getElementById('increaseScrollSpeedButton').addEventListener('click', () => {
    currentScrollSpeed += 1; // Increase the scroll speed by 1
});

document.getElementById('decreaseScrollSpeedButton').addEventListener('click', () => {
    currentScrollSpeed -= 1; // Decrease the scroll speed by 1
});

function restartScrolling(iframeId, initialScrollSpeed, speedChangeTime, newScrollSpeed, intervalTime) {
    stopScrolling(); // Stop any ongoing scrolling
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
    iframeDocument.body.scrollTop = 0; // Scroll to the top
    currentScrollPosition = 0; // Reset the current scroll position
    currentScrollSpeed = initialScrollSpeed; // Reset the current scroll speed
}