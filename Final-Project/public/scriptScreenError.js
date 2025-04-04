// Flag for screen dimension error
let warningClosed = false;

function checkScreenDimensions() {
    const warning = document.getElementById('warning');
    if (window.innerWidth < 1040) {
        if (!warningClosed) {
            warning.style.display = 'block';
        }
    } else {
        warning.style.display = 'none';

        // Reset the flag when dimensions are greater than 800
        warningClosed = false;
    }
}

// Check dimensions on load
checkScreenDimensions();

// Check dimensions on resize
window.addEventListener('resize', checkScreenDimensions);

// Close button functionality
document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('warning').style.display = 'none';
    warningClosed = true; // Set the flag to true when the warning is closed
});