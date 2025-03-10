let scrollInterval;
let speedTimeout;
let currentScrollPosition = 0;

// Stores the speed adjusted from tempo changes
let currentScrollSpeed;
let scrolling = false;
let scrollSpeed;
let imageInView = false;
let warningClosed = false;
let hasStartedScrolling = false;

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

/* 
Takes in an ID for an iFrame, ID for the button container style, and the "this" parameter for
the actual Show/Hide button to toggle the menu 

Each iFrame has an ID that maps to the individual HTML files under tabs. This displays
the sheet music within a smaller window to be scrolled manually or automatically
*/
function toggleIframeAndButtons(iframeId, buttonContainerId, button) {
    const iframe = document.getElementById(iframeId);
    const buttonContainer = document.getElementById(buttonContainerId);

    /* 
    Get the containerMusicTrack and sibling buttons, this is retrieved now to later be used for the smooth
    scrolling effect when the iframe is shown
    */
    const containerMusicTrack = button.closest('.containerMusicTrack');

    /* 
    Retrieve all the buttons within the previous containerMusicTrack
    Naming convention is buttonShow because this is the CSS style for all buttons, onced viewable/shown
    */
    const siblingButtons = containerMusicTrack.querySelectorAll('.buttonShow');

    /*
    Create a new variable for either Rythm or Lead sheet music, and hide the other if one is chosen.
    Ternary operation is used for the other sheet music option, Lead or Rhythm. This is stored later to be hidden
    from view.
    */
    const otherIframeId = iframeId === 'iframeLead' ? 'iframeRhythm' : 'iframeLead';
    const otherButtonContainerId = buttonContainerId === 'buttonContainerLead' ? 'buttonContainerRhythm' : 'buttonContainerLead';
    const otherIframe = document.getElementById(otherIframeId);
    const otherButtonContainer = document.getElementById(otherButtonContainerId);

    /*
    If the iframe is hidden or not displayed, show the iframe and button container
    Set up the buttons to be displayed in block format, with a flex container for the buttons
    Set the button text to "Hide", from Show, and scroll to the iframe smoothly
    */
    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        buttonContainer.style.display = "flex";
        button.textContent = "Hide";
        buttonContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to the iframe smoothly

        /* Hide sibling buttons IF not contained from the original button click, from the other Lead or Rhythm 
        sheet music option */
        siblingButtons.forEach(siblingButton => {
            if (siblingButton !== button) {
                siblingButton.style.display = "none";
            }
        });

        // Hide the other iFrame, Lead or Rhythm depending on what was chosen, and its button container
        otherIframe.style.display = "none";
        otherButtonContainer.style.display = "none";
    }

    else {
        resetScrolling(iframeId, 0); // Reset scrolling when the iFrame is hidden, meaning "Hide" was clicked
        iframe.style.display = "none";
        buttonContainer.style.display = "none";
        button.textContent = button.getAttribute('data-original-text'); // Restore original text
        containerMusicTrack.scrollIntoView({ behavior: 'smooth' }); // Scroll to the top of the guitarTab container smoothly

        // Display the Lead or Rhythm options again, previously was hidden when one choice was selected instead of the other
        siblingButtons.forEach(siblingButton => {
            siblingButton.style.display = "inline-block";
        });
    }
}

/*
Function to automically scroll the iframe, takes in the iframe ID, speed, backing track ID, and tempo changes

Tempo changes are used to increase the scroll speed when a certain part of the sheet music is in view.
In reality, an observer is used to detect a transparent square that is placed over the sheet music image.
*/

function showCountdown(callback) {
    const countdownContainer = document.createElement('div');
    countdownContainer.id = 'countdown-container';
    countdownContainer.style.position = 'fixed';
    countdownContainer.style.top = '50%';
    countdownContainer.style.left = '50%';
    countdownContainer.style.transform = 'translate(-50%, -50%)';
    countdownContainer.style.fontSize = '3em';
    countdownContainer.style.color = 'white';
    countdownContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    countdownContainer.style.padding = '20px';
    countdownContainer.style.borderRadius = '10px';
    countdownContainer.style.textAlign = 'center';
    document.body.appendChild(countdownContainer);

    let countdown = 3;
    countdownContainer.textContent = countdown;

    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownContainer.textContent = countdown;
        } else if (countdown === 0) {
            countdownContainer.textContent = 'GO';
        } else {
            clearInterval(interval);
            document.body.removeChild(countdownContainer);
            callback();
        }
    }, 1000);
}

function startScrolling(iframeId, originalSpeed, backingTrackId, tempoChanges) {
    /* Safety check to prevent multiple scrolling instances, if true, end the function 
    (return block execute lways ends a function) */
    if (scrolling) {
        return;
    } 

    /* Ensure any existing scrolling is paused before starting a new one
    Also pauses any audio */
    pauseScrolling(); 

    // Retrive the iFrame ID, this is where the sheet music is displayed
    const iframe = document.getElementById(iframeId);
    /* 
    Also retrive the entire DOM of the HTML file, recall the iFrame is a separate HTML file and is located
    under tabs
    */
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    // scrollSpeed will attempt to be assigned to the currentScrollSpeed, as modified from the tempo changes,
    // But in the instance of the first function call, the original passed in parameter speed is used.
    let scrollSpeed = currentScrollSpeed || originalSpeed;

    // Accumulated scroll is used to keep track of the fractional part of the scroll speed
    let accumulatedScroll = 0;

    // Play the audio if it exists
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        audio.play();
    }

        /*
    The observer is used to detect when the transparent square is in view, which is placed over the sheet music image.
    When the square is in view, the scroll speed is increased to the tempo change speed.
    */
    const observer = new IntersectionObserver(increaseScrollSpeed, {
        root: iframeDocument,

        // Threshold of 1.0 means the entire target
        threshold: 1.0
    });

    tempoChanges.forEach(change => {
        const targetImage = iframeDocument.getElementById(change.tempoChangePageID);
        if (targetImage) {
            observer.observe(targetImage);
        }
    });

    /* 
    Function to increase scroll speed when image is in view
    entires parameter is provided by the observer API, and is an array of IntersectionObserverEntry objects
    */
    function increaseScrollSpeed(entries) {
        entries.forEach(entry => {
            // If the transparent square is in view, the conditional block is executed; it is true
            if (entry.isIntersecting) {
                /*
                Tempo change values are stored as an array, with a corresponding ID and speed value
                Entry.target.id is the ID of the image in the sheet music that the observer API is watching
                Once intersecting, assign the tempoChangeID array value to the entry.target.id
                */
                const tempoChange = tempoChanges.find(change => change.tempoChangePageID === entry.target.id);
                // If the tempo change is found, true, set the scroll speed to the tempo change speed
                if (tempoChange) {
                    scrollSpeed = tempoChange.tempoChangeSpeed;
                    // currentScrollSpeed is now set to the tempo change speed
                    currentScrollSpeed = scrollSpeed;
                }
            }
        });
    }

    // Function to scroll the iframe
    function scrollIframe() {
        /*
        accumulatedScroll is initially zero, but will be updated in accordance with the tempo changes
        modified from the increaseScrollSpeed function
        */
        accumulatedScroll += scrollSpeed;
        const scrollAmount = Math.floor(accumulatedScroll);
        accumulatedScroll -= scrollAmount;

        iframe.contentWindow.scrollBy(0, scrollAmount);
        if (scrolling) {
            requestAnimationFrame(scrollIframe);
        }
    }

    function startScrollProcess() {
        scrolling = true;
        scrollIframe();
    }

    showCountdown(startScrollProcess);
}

function pauseScrolling(backingTrackId) {
    scrolling = false;

    // Pause the audio if it exists
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        audio.pause();
    }
}

function resetScrolling(iframeId, backingTrackId) {
    const iframe = document.getElementById(iframeId);
    const contentWindow = iframe.contentWindow;

    pauseScrolling(backingTrackId);
    contentWindow.scrollTo(0, 0);
    currentScrollSpeed = null;

    // Reset the audio if it exists
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        audio.currentTime = 0;
    }
}