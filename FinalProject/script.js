// let scrollInterval;
// let speedTimeout;
// let currentScrollPosition = 0;
// let currentScrollSpeed = 0;
// let scrolling = false;
// let scrollSpeed;
// let imageInView = false;

// function resetScrolling(iframeId, initialScrollSpeed) {
//     pauseScrolling(); // Stop any ongoing scrolling
//     const iframe = document.getElementById(iframeId);
//     const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//     iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
//     iframeDocument.body.scrollTop = 0; // Scroll to the top
//     currentScrollPosition = 0; // Reset the current scroll position
//     currentScrollSpeed = initialScrollSpeed; // Reset the current scroll speed
//     iframe.contentWindow.scrollTo(0, 0);
//     scrolling = false;
//     imageInView = false;
// }

// function startScrolling(iframeId, speed, tempoChangePageID, tempoChangeSpeed) {
//     pauseScrolling(); // Ensure any existing scrolling is stopped before starting a new one

//     const iframe = document.getElementById(iframeId);
//     const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//     let scrollSpeed = currentScrollSpeed || speed;
//     let accumulatedScroll = 0;

//     // Function to increase scroll speed when image is in view
//     function increaseScrollSpeed(entries) {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 scrollSpeed = tempoChangeSpeed;
//                 currentScrollSpeed = scrollSpeed; // Maintain the current scroll speed
//             }
//         });
//     }

//     // Create an IntersectionObserver
//     const observer = new IntersectionObserver(increaseScrollSpeed, {
//         root: iframeDocument,
//         threshold: 0.1
//     });

//     // Observe the target image
//     const targetImage = iframeDocument.getElementById(tempoChangePageID);
//     if (targetImage) {
//         observer.observe(targetImage);
//     }

//     // Function to scroll the iframe
//     function scrollIframe() {
//         accumulatedScroll += scrollSpeed;
//         const scrollAmount = Math.floor(accumulatedScroll);
//         accumulatedScroll -= scrollAmount;

//         iframe.contentWindow.scrollBy(0, scrollAmount);
//         if (scrolling) {
//             requestAnimationFrame(scrollIframe);
//         }
//     }

//     // Start scrolling
//     scrolling = true;
//     scrollIframe();
// }

// function pauseScrolling() {
//     scrolling = false;
// }

// function resetScrolling(iframeId) {
//     const iframe = document.getElementById(iframeId);
//     const contentWindow = iframe.contentWindow;

//     pauseScrolling();
//     contentWindow.scrollTo(0, 0);
//     currentScrollSpeed = null;
// }

let scrollAnimationFrame;

function startScrolling(iframeId, duration) {
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const element = iframeDocument.documentElement; // Use documentElement for scrolling

    const totalHeight = element.scrollHeight - element.clientHeight;
    const startTime = performance.now();

    const step = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        element.scrollTop = progress * totalHeight;

        if (progress < 1) {
            scrollAnimationFrame = window.requestAnimationFrame(step);
        }
    };

    scrollAnimationFrame = window.requestAnimationFrame(step);
}

function pauseScrolling() {
    if (scrollAnimationFrame) {
        window.cancelAnimationFrame(scrollAnimationFrame);
    }
}

function resetScrolling(iframeId) {
    pauseScrolling();
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const element = iframeDocument.documentElement; // Use documentElement for scrolling
    element.scrollTop = 0;
}

function toggleIframeAndButtons(iframeId, containerId, button) {
    const iframe = document.getElementById(iframeId);
    const container = document.getElementById(containerId);
    if (container.style.display === 'none') {
        container.style.display = 'block';
        button.textContent = button.getAttribute('data-original-text');
    } else {
        container.style.display = 'none';
        button.textContent = 'Show ' + button.getAttribute('data-original-text');
    }
}