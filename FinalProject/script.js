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
    const siblingButtons = containerMusicTrack.querySelectorAll('.buttonShow'); // Get all buttons within the same container

    // Define the IDs of the other iframes and their button containers
    const otherIframeId = iframeId === 'iframeParanoidLead' ? 'iframeParanoidRhythm' : 'iframeParanoidLead';
    const otherButtonContainerId = buttonContainerId === 'buttonContainerLead' ? 'buttonContainerRhythm' : 'buttonContainerLead';

    const otherIframe = document.getElementById(otherIframeId);
    const otherButtonContainer = document.getElementById(otherButtonContainerId);

    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        buttonContainer.style.display = "flex";
        button.textContent = "Hide";
        buttonContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to the iframe smoothly

        // Hide sibling buttons
        siblingButtons.forEach(siblingButton => {
            if (siblingButton !== button) {
                siblingButton.style.display = "none";
            }
        });

        // Hide the other iframe and its button container
        otherIframe.style.display = "none";
        otherButtonContainer.style.display = "none";
    } else {
        resetScrolling(iframeId, 0); // Reset scrolling when the iframe is hidden
        iframe.style.display = "none";
        buttonContainer.style.display = "none";
        button.textContent = button.getAttribute('data-original-text'); // Restore original text
        containerMusicTrack.scrollIntoView({ behavior: 'smooth' }); // Scroll to the top of the guitarTab container smoothly

        // Show sibling buttons
        siblingButtons.forEach(siblingButton => {
            siblingButton.style.display = "inline-block";
        });
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

function startScrollingWithTempoChange(iframeId, speed, tempoChangePageID, tempoChangeSpeed) {
    pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollSpeed = currentScrollSpeed || speed;

    // Function to increase scroll speed when image is in view
    function increaseScrollSpeed(entries) {
        // The entries parameter is provided by the IntersectionObserver
        // It contains an array of IntersectionObserverEntry objects, which
        // represent the elements that are currently intersecting with the observer
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                scrollSpeed = tempoChangeSpeed;
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
    const targetImage = iframeDocument.getElementById(tempoChangePageID);
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