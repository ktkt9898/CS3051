let scrollInterval;
let speedTimeout;
let currentScrollPosition = 0;
let currentScrollSpeed = 0;
let scrolling = false;
let scrollSpeed;
let imageInView = false;

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
    scrolling = false;
    // Do not reset scrollSpeed to 0 here
}

function resetScrolling(iframeId, initialScrollSpeed) {
    pauseScrolling(); // Stop any ongoing scrolling
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
    iframeDocument.body.scrollTop = 0; // Scroll to the top
    currentScrollPosition = 0; // Reset the current scroll position
    currentScrollSpeed = initialScrollSpeed; // Reset the current scroll speed
    iframe.contentWindow.scrollTo(0, 0);
    scrolling = false;
    imageInView = false;
}

function startScrollingWithTempoChange(iframeId, speed) {
    pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollSpeed = currentScrollSpeed || speed;

    // Function to increase scroll speed when image is in view
    function increaseScrollSpeed(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollSpeed = 5;
                imageInView = true;
                currentScrollSpeed = scrollSpeed; // Maintain the current scroll speed
            }
        });
    }

    // Create an IntersectionObserver
    const observer = new IntersectionObserver(increaseScrollSpeed, {
        root: iframeDocument,
        threshold: 0.1
    });

    // Observe the target image
    const targetImage = iframeDocument.getElementById('onePg2');
    if (targetImage) {
        observer.observe(targetImage);
    }

    // Function to scroll the iframe
    function scrollIframe() {
        iframe.contentWindow.scrollBy(0, scrollSpeed);
        if (scrolling) {
            requestAnimationFrame(scrollIframe);
        }
    }

    // Start scrolling
    scrolling = true;
    scrollIframe();
}

// // Function to start scrolling with tempo change
// function startScrollingWithTempoChange(iframeId, speed) {
//     pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

//     const iframe = document.getElementById(iframeId);
//     const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//     let scrollSpeed = currentScrollSpeed || speed;

//     // Function to increase scroll speed when image is in view
//     function increaseScrollSpeed(entries) {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 scrollSpeed = 5;
//                 imageInView = true;
//                 currentScrollSpeed = scrollSpeed; // Maintain the current scroll speed
//             } else if (!imageInView) {
//                 scrollSpeed = speed;
//             }
//         });
//     }

//     // Create an IntersectionObserver
//     const observer = new IntersectionObserver(increaseScrollSpeed, {
//         root: iframeDocument,
//         threshold: 0.1
//     });

//     // Observe the target image
//     const targetImage = iframeDocument.getElementById('onePg2');
//     if (targetImage) {
//         observer.observe(targetImage);
//     }

//     // Function to scroll the iframe
//     function scrollIframe() {
//         iframe.contentWindow.scrollBy(0, scrollSpeed);
//         if (scrolling) {
//             requestAnimationFrame(scrollIframe);
//         }
//     }

//     // Start scrolling
//     scrolling = true;
//     scrollIframe();
// }