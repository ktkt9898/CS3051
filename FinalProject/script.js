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
        resetScrolling(iframeId, 0); // Reset scrolling when the iframe is hidden
        iframe.style.display = "none";
        buttonContainer.style.display = "none";
        button.textContent = "Show";
        containerMusicTrack.scrollIntoView({ behavior: 'smooth' }); // Scroll to the top of the guitarTab container smoothly
    }
}

// Scroll function without tempo change in song
function startScrolling(iframeId, initialScrollSpeed) {
    pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
    let scrollSpeed = initialScrollSpeed || currentScrollSpeed;

    // Set the interval for scrolling
    scrollInterval = setInterval(() => {
        scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
    }, 10); // Set the interval time to control the refresh rate
}

function pauseScrolling() {
    clearInterval(scrollInterval);
    clearTimeout(speedTimeout);
}

function resetScrolling(iframeId, initialScrollSpeed) {
    pauseScrolling(); // Stop any ongoing scrolling
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
    iframeDocument.body.scrollTop = 0; // Scroll to the top
    currentScrollPosition = 0; // Reset the current scroll position
    currentScrollSpeed = initialScrollSpeed; // Reset the current scroll speed
}

// function startScrollingWithTempoChange(iframeId, initialScrollSpeed, speedChangeTime = 10000, newScrollSpeed = 7) {
//     pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

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

function startScrollingWithTempoChange(iframeId, initialScrollSpeed, speedChangeTime = 10000, newScrollSpeed = 7) {
    pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = currentScrollPosition || iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;
    let scrollSpeed = currentScrollSpeed || initialScrollSpeed;

    // Function to check if the image is viewable within the iframe
    function isImageViewable(image) {
        const rect = image.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();
        return (
            rect.top >= iframeRect.top &&
            rect.bottom <= iframeRect.bottom &&
            rect.left >= iframeRect.left &&
            rect.right <= iframeRect.right
        );
    }

    // Set the interval for scrolling
    scrollInterval = setInterval(() => {
        scrollPosition += scrollSpeed; // Increment the scroll position by the current scroll speed
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
        currentScrollPosition = scrollPosition; // Update the current scroll position

        // Check if the image is viewable and increase the scroll speed
        const image = iframeDocument.querySelector('img[src="scores/One/One_pg_2.png"]');
        if (image && isImageViewable(image)) {
            scrollSpeed += 5; // Increase the scroll speed by 5
        }
    }, 10); // Set the interval time to control the refresh rate

    // Change the scroll speed after a specified time
    speedTimeout = setTimeout(() => {
        scrollSpeed = newScrollSpeed; // Update the scroll speed
        currentScrollSpeed = newScrollSpeed; // Update the current scroll speed
    }, speedChangeTime); // Time in milliseconds after which the scroll speed changes
}