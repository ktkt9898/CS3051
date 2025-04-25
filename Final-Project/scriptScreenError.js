// Flag for screen dimension error
let warningClosed = false;

function checkScreenDimensions() {
    const warning = document.getElementById('warning');
    // If screen width is less than 1040px, show the warning
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
document.getElementById('buttonWarningClose').addEventListener('click', function () {
    document.getElementById('warning').style.display = 'none';
    warningClosed = true; // Set the flag to true when the warning is closed
});