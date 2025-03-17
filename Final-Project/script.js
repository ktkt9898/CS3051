let scrollInterval;
let speedTimeouts = [];
let currentScrollPosition = 0;
let currentSpeed;
let elapsedTime = 0;
let scrolling = false;

// Flag to stop the operation of the scrolling, if Hide is clicked
let stopOperation = false; 

// Stores the speed adjusted from tempo changes
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
document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('warning').style.display = 'none';
    warningClosed = true; // Set the flag to true when the warning is closed
});

/**
Takes in an ID for an iFrame, ID for the button container style, and the "this" parameter for
the actual Show/Hide button to toggle the menu 

Each iFrame has an ID that maps to the individual HTML files under tabs. This displays
the sheet music within a smaller window to be scrolled manually or automatically
*/
function toggleIframeAndButtons(iframeId, buttonContainerId, button, backingTrackId) {
    const iframe = document.getElementById(iframeId);
    const buttonContainer = document.getElementById(buttonContainerId);

    /**
    Get the containerMusicTrack and sibling buttons, this is retrieved now to later be used for the smooth
    scrolling effect when the iframe is shown
    */
    const containerMusicTrack = button.closest('.containerMusicTrack');

    /**
    Retrieve all the buttons within the previous containerMusicTrack
    Naming convention is buttonShow because this is the CSS style for all buttons, onced viewable/shown
    */
    const siblingButtons = containerMusicTrack.querySelectorAll('.buttonShow');

    /**
    Create a new variable for either Rythm or Lead sheet music, and hide the other if one is chosen.
    Ternary operation is used for the other sheet music option, Lead or Rhythm. This is stored later to be hidden
    from view.
    */
    const otherIframeId = iframeId === 'iframeLead' ? 'iframeRhythm' : 'iframeLead';
    const otherButtonContainerId = buttonContainerId === 'buttonContainerLead' ? 'buttonContainerRhythm' : 'buttonContainerLead';
    const otherIframe = document.getElementById(otherIframeId);
    const otherButtonContainer = document.getElementById(otherButtonContainerId);

    /**
    If the iframe is hidden or not displayed, show the iframe and button container
    Set up the buttons to be displayed in block format, with a flex container for the buttons
    Set the button text to "Hide", from Show, and scroll to the iframe smoothly
    */
    if (iframe.style.display === "none" || iframe.style.display === "") {
        iframe.style.display = "block";
        buttonContainer.style.display = "flex";
        button.textContent = "Hide";

        // Scroll to the iframe smoothly
        buttonContainer.scrollIntoView({ behavior: 'smooth' }); 

        /**
        Hide sibling buttons IF not contained from the original button click, from the other Lead or Rhythm 
        sheet music option 
        */
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
        // Set the flag to stop the operation of the scrolling, if Hide is clicked
        stopOperation = true; 

        // Reset scrolling when the iFrame is hidden, meaning "Hide" was clicked
        resetScrolling(iframeId, backingTrackId);
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

/**
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
        // If Hide was clicked, stop the operation and remove the countdown container
        if (stopOperation) {
            clearInterval(interval);
            document.body.removeChild(countdownContainer);
            return;
        }
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

/**
The startScrolling function performs the main feature of the automatic scrolling of the sheet music.
It takes in the iframe ID, initial speed, backing track ID, and speed changes.
Speed changes are an array of objects that contain the time and speed change.

The main idea is to start with an initial speed and then change the speed at certain times to match 
the tempo of the backing track.

The three main concepts are scrollContent, updateElapsedTime, and the speed changes.
scrollContent is the function that performs the scrolling, and is called every 16.67ms to maintain a 60Hz refresh rate.
updateElapsedTime is a recursive function that keeps track of the elapsed time while scrolling is active.
    This is used when pausing and resuming the scrolling, so the speed changes are the consistent.
speedChanges is an array that containts a time and speed change, since some parts of the sheet music may be faster or slower.
*/
function startScrolling(iframeId, initialSpeed, backingTrackId, speedChanges) {
    // Reset the flag to false when starting the scrolling operation
    stopOperation = false; 
    showCountdown(() => {
        if (stopOperation) {
            return;
        }
        const iframe = document.getElementById(iframeId);
        const contentWindow = iframe.contentWindow;
        const audio = document.getElementById(backingTrackId);

        // Use the current speed if it exists, otherwise use the initial speed
        currentSpeed = currentSpeed || initialSpeed;

        // Start keeping track of the elapsed time, so pausing can resume at the same exact position
        let startTime = Date.now();

        // Function to perform the scrolling
        function scrollContent() {
            if (scrolling && !stopOperation) {
                currentScrollPosition += currentSpeed;
                contentWindow.scrollTo(0, currentScrollPosition);

                // Schedule the next scroll
                requestAnimationFrame(scrollContent); 
            }
        }

        // Start the audio if it exists
        if (audio) {
            audio.play();
        }

        // Start the initial scrolling
        scrolling = true;

        /**
        Cap to 60Hz to maintain consistent scrolling speed across devices
        1000 / 60 is used to approimate 16.67ms which corresponds to 60Hz refresh rate
        So, set the scrollContent speed interval to update every 16.67ms, or a 60hz refresh rate
        */
        requestAnimationFrame(scrollContent);

        /**
        Speed changes are the array passed in that contains the time interval and associated
        speed change
        If the specified time is greater than the elapsed time, set a timeout to change the speed
        The variable "change" is the element in the array that contains the time and speed change
        The adjustedTime is the time minus the elapsed time, and if it is greater than 0, set a timeout
        */
        speedChanges.forEach(change => {
            const adjustedTime = change.time - elapsedTime;
            if (adjustedTime > 0) {
                const timeout = setTimeout(() => {
                    currentSpeed = change.speed;
                }, adjustedTime);

                // Store the timeout to be cleared later, when pausing or reseting the scrolling
                speedTimeouts.push(timeout);
            }
        });

        /** 
        Check if scrolling is active, and ensure the elapsed time is continuously updated
        The global variable "elapsedTime" is updated to keep track of the time when the 
        scrolling is paused.
        The new elapsedTime is the current time minus the start time, and is used to update the
        adjustedTime variable.
        updateElapsedTime is recursively called to keep track of the elapsed time while scrolling is true
        */
        function updateElapsedTime() {
            if (scrolling && !stopOperation) {
                elapsedTime += Date.now() - startTime;
                startTime = Date.now();
                requestAnimationFrame(updateElapsedTime);
            }
        }
        updateElapsedTime();
    });
}

function pauseScrolling(backingTrackId) {
    scrolling = false;

    // Pause the audio if it exists
    const audio = document.getElementById(backingTrackId); 
    if (audio) {
        audio.pause();
    }

    // Clear the scroll interval and speed timeouts
    clearInterval(scrollInterval); 
    speedTimeouts.forEach(timeout => clearTimeout(timeout));
    speedTimeouts = [];
}

function resetScrolling(iframeId, backingTrackId) {
    const iframe = document.getElementById(iframeId);
    const contentWindow = iframe.contentWindow;

    // Reset the flag to false when reseting the scrolling operation
    stopOperation = false; 

    // Also reset the scrolling flag to false
    scrolling = false; 
    pauseScrolling(backingTrackId);
    contentWindow.scrollTo(0, 0);
    currentScrollPosition = 0;
    currentSpeed = null;
    elapsedTime = 0;

    // Reset the audio if it exists
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        // Pause the audio
        audio.pause();

        // And set the audio to the beginning, for the next time it is played
        audio.currentTime = 0;
    }
}

// New functions for manual control
function manualStartScrolling(iframeId, backingTrackId) {
    startScrolling(iframeId, 0.2, backingTrackId, []);
}

function increaseSpeed() {
    if (currentSpeed !== null) {
        currentSpeed += 0.1;
    }
}

function decreaseSpeed() {
    if (currentSpeed !== null && currentSpeed > 0.1) {
        currentSpeed -= 0.1;
    }
}