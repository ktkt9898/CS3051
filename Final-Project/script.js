let scrollInterval;
let speedTimeout;
let currentScrollPosition = 0;
let currentScrollSpeed = 0;
let scrolling = false;
let scrollSpeed;
let imageInView = false;
let warningClosed = false;

function checkScreenDimensions() {
    const warning = document.getElementById('warning');
    if (window.innerWidth < 1040) {
        if (!warningClosed) {
            warning.style.display = 'block';
        }
    } else {
        warning.style.display = 'none';
        warningClosed = false; // Reset the flag when dimensions are greater than 800
    }
}

// Check dimensions on load
checkScreenDimensions();

// Check dimensions on resize
window.addEventListener('resize', checkScreenDimensions);

// Close button functionality
document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('warning').style.display = 'none';
    warningClosed = true; // Set the flag to true when the warning is closed
});

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

function startScrolling(iframeId, speed, tempoChanges) {
    if (scrolling) {
        return;
    } 

    pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollSpeed = currentScrollSpeed || speed;
    let accumulatedScroll = 0;

    // Function to increase scroll speed when image is in view
    function increaseScrollSpeed(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tempoChange = tempoChanges.find(change => change.tempoChangePageID === entry.target.id);
                if (tempoChange) {
                    scrollSpeed = tempoChange.tempoChangeSpeed;
                    currentScrollSpeed = scrollSpeed; // Maintain the current scroll speed
                }
            }
        });
    }

    // Create an IntersectionObserver
    const observer = new IntersectionObserver(increaseScrollSpeed, {
        root: iframeDocument,
        threshold: 1.0
    });

    // Observe the target images
    tempoChanges.forEach(change => {
        const targetImage = iframeDocument.getElementById(change.tempoChangePageID);
        if (targetImage) {
            observer.observe(targetImage);
        }
    });

    // Function to scroll the iframe
    function scrollIframe() {
        accumulatedScroll += scrollSpeed;
        const scrollAmount = Math.floor(accumulatedScroll);
        accumulatedScroll -= scrollAmount;

        iframe.contentWindow.scrollBy(0, scrollAmount);
        if (scrolling) {
            requestAnimationFrame(scrollIframe);
        }
    }

    // Start scrolling
    scrolling = true;
    scrollIframe();
}

function pauseScrolling() {
    scrolling = false;
}

function resetScrolling(iframeId) {
    const iframe = document.getElementById(iframeId);
    const contentWindow = iframe.contentWindow;

    pauseScrolling();
    contentWindow.scrollTo(0, 0);
    currentScrollSpeed = null;
}