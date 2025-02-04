let scrollInterval;

function toggleIframeAndButtons(iframeId, containerId) {
    stopScrolling(); // Stop any ongoing scrolling when show/hide button is clicked
    const iframe = document.getElementById(iframeId);
    const container = document.getElementById(containerId);
    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        container.style.display = "block";
    } else {
        iframe.style.display = "none";
        container.style.display = "none";
    }
}

function startScrolling(iframeId) {
    stopScrolling(); // Ensure any existing scrolling is stopped before starting a new one

    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    let scrollPosition = iframeDocument.documentElement.scrollTop || iframeDocument.body.scrollTop;

    scrollInterval = setInterval(() => {
        scrollPosition += 1; // Adjust the scroll speed by changing this value
        iframeDocument.documentElement.scrollTop = scrollPosition;
        iframeDocument.body.scrollTop = scrollPosition;
    }, 50); // Adjust the interval time to control the speed
}

function stopScrolling() {
    clearInterval(scrollInterval);
}

function restartScrolling(iframeId) {
    stopScrolling(); // Stop any ongoing scrolling
    const iframe = document.getElementById(iframeId);
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.documentElement.scrollTop = 0; // Scroll to the top
    iframeDocument.body.scrollTop = 0; // Scroll to the top
}