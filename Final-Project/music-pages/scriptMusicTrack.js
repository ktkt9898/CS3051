// This script is used to control the automatic scrolling of sheet music in an iframe.
// It includes functions to start, pause, and reset the scrolling, as well as to change the speed of the scrolling.
let scrollInterval;

// Global variable to store the timeouts for speed changes
// This is used to clear the timeouts when pausing or resetting the scrolling
let speedTimeouts = [];

// Global variable to track the current scroll position of the iframe
// This is used to keep track of the current position of the scrolling content
let currentScrollPosition = 0;

// Global variable to track the current speed of the scrolling
// This is used to adjust the speed dynamically based on the speed changes
let currentSpeed;

// Global variable to track the elapsed time for speed changes
// This is used to ensure that the speed changes are consistent even when pausing and resuming scrolling
let elapsedTime = 0;

// Flag to indicate if scrolling is in progress, broadly used to prevent multiple clicks
let scrolling = false;

// Flag to prevent multiple Start button clicks
let scrollingInProgressStartButton = false;

// Flag to rpevent multiple Manual Start button clicks
let scrollingInProgressManualButton = false;

// Flag to stop the operation of the scrolling, if Hide is clicked
let stopCountdownOperation = false;

// New global variable to track if scrolling was started manually
let isManual = false;

/**
 * toggleIframeAndButtons function
 * Toggles the visibility of the iframe and button container, and handles the display of buttons.
 * @param {*} iframeId 
 * @param {*} buttonContainerId 
 * @param {*} button 
 * @param {*} backingTrackId 
 * @param {*} startButtonId 
 * @param {*} manualStartButtonId 
 * @param {*} increaseButtonId 
 * @param {*} decreaseButtonId 
 */
function toggleIframeAndButtons(iframeId, buttonContainerId, button, backingTrackId, startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId) {
    const iframe = document.getElementById(iframeId);
    const buttonContainer = document.getElementById(buttonContainerId);

    /**
    Get the musicPageBackground and sibling buttons, this is retrieved now to later be used for the smooth
    scrolling effect when the iframe is shown
    */
    const musicPageBackground = button.closest('.musicPageBackground');

    /**
    Retrieve all the buttons within the previous musicPageBackground
    Naming convention is buttonShow because this is the CSS style for all buttons, onced viewable/shown
    */
    const siblingButtons = musicPageBackground.querySelectorAll('.buttonShow');

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
        // Reset the countdown operation flag to false when the iframe is shown
        stopCountdownOperation = false;

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

        console.log(stopCountdownOperation);
    }

    else {
        // Set the stop countdown operation flag to true when the iframe is hidden
        stopCountdownOperation = true;

        // Reset scrolling when the iFrame is hidden, meaning "Hide" was clicked
        resetScrolling(iframeId, backingTrackId, startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId);

        iframe.style.display = "none";
        buttonContainer.style.display = "none";
        button.textContent = button.getAttribute('data-original-text'); // Restore original text
        musicPageBackground.scrollIntoView({ behavior: 'smooth' }); // Scroll to the top of the guitarTab container smoothly

        // Display the Lead or Rhythm options again, previously was hidden when one choice was selected instead of the other
        siblingButtons.forEach(siblingButton => {
            siblingButton.style.display = "inline-block";
        });
    }
}

/**
 * showCountdown function
 * Displays a countdown from 3 to 0, and then calls the provided callback function.
 * @param {*} callback 
 * @returns 
 */
function showCountdown(callback) {
    // Check if stopCountdownOperation is true at the beginning of the function
    // If true, cancel the operation and return
    if (stopCountdownOperation) {
        return;
    }

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
        // Safety check again to see if the countdown operation should be stopped
        if (stopCountdownOperation) {
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
 * startScrolling function
 * Starts the scrolling of the iframe content, plays the backing track, and handles speed changes.
 * @param {*} iframeId 
 * @param {*} initialSpeed 
 * @param {*} backingTrackId 
 * @param {*} speedChanges 
 * @param {*} startButtonId 
 * @param {*} manualStartButtonId 
 * @param {*} increaseButtonId 
 * @param {*} decreaseButtonId 
 * @returns 
 */
function startScrolling(iframeId, initialSpeed, backingTrackId, speedChanges, startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId) {
    // Once start scrolling is called, set the stop countdown flag to false
    stopCountdownOperation = false;

    if (scrollingInProgressStartButton) {
        return;
    }
    scrollingInProgressStartButton = true;
    scrollingInProgressManualButton = false;

    showCountdown(() => {
        const iframe = document.getElementById(iframeId);
        const contentWindow = iframe.contentWindow;
        const audio = document.getElementById(backingTrackId);

        // Use the current speed if it exists, otherwise use the initial speed
        currentSpeed = currentSpeed || initialSpeed;

        // Start keeping track of the elapsed time, so pausing can resume at the same exact position
        let startTime = Date.now();

        // Function to perform the scrolling
        function scrollContent() {
            if (scrolling && !stopCountdownOperation) {
                currentScrollPosition += currentSpeed;
                contentWindow.scrollTo(0, currentScrollPosition);

                // Schedule the next scroll
                requestAnimationFrame(scrollContent);
            }
        }

        // Start the audio if it exists
        if (audio && !stopCountdownOperation) {
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
            if (scrolling && !stopCountdownOperation) {
                elapsedTime += Date.now() - startTime;
                startTime = Date.now();
                requestAnimationFrame(updateElapsedTime);
            }
        }
        updateElapsedTime();
    });

    disableButtons([startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId]);
}

/**
 * pauseScrolling function
 * Pauses the scrolling of the iframe content, stops the backing track, and clears speed timeouts.
 * @param {*} backingTrackId 
 * @param {*} startButtonId 
 * @param {*} manualStartButtonId 
 */
function pauseScrolling(backingTrackId, startButtonId, manualStartButtonId) {
    scrolling = false;

    if (scrollingInProgressStartButton) {
        scrollingInProgressStartButton = false;
        enableButtons([startButtonId]);
        disableButtons([manualStartButtonId]);
    } else if (scrollingInProgressManualButton) {
        scrollingInProgressManualButton = false;
        enableButtons([manualStartButtonId]);
        disableButtons([startButtonId]);
    }

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

/**
 * resetScrolling function
 * Resets the scrolling of the iframe content, stops the backing track, and clears speed timeouts.
 * @param {*} iframeId 
 * @param {*} backingTrackId 
 * @param {*} startButtonId 
 * @param {*} manualStartButtonId 
 * @param {*} increaseButtonId 
 * @param {*} decreaseButtonId 
 */
function resetScrolling(iframeId, backingTrackId, startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId) {
    const iframe = document.getElementById(iframeId);
    const contentWindow = iframe.contentWindow;

    // Reset the stop countdown operation flag to true
    stopCountdownOperation = true;

    // Also reset the scrolling flag to false
    scrolling = false;

    // Reset the two flags for the Start and Manual Start buttons
    scrollingInProgressStartButton = false;
    scrollingInProgressManualButton = false;
    pauseScrolling(backingTrackId, startButtonId, manualStartButtonId);
    contentWindow.scrollTo(0, 0);
    currentScrollPosition = 0;
    currentSpeed = null;
    elapsedTime = 0;
    isManual = false;

    // Reset the audio if it exists
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        // Pause the audio
        audio.pause();

        // And set the audio to the beginning, for the next time it is played
        audio.currentTime = 0;
    }

    disableButtons([increaseButtonId, decreaseButtonId]);
    enableButtons([startButtonId, manualStartButtonId]);
}

/**
 * manualStartScrolling function
 * Starts the scrolling of the iframe content with manual speed control, plays the backing track, and handles speed changes.
 * @param {*} iframeId 
 * @param {*} backingTrackId 
 * @param {*} startButtonId 
 * @param {*} manualStartButtonId 
 * @param {*} increaseButtonId 
 * @param {*} decreaseButtonId 
 * @returns 
 */
function manualStartScrolling(iframeId, backingTrackId, startButtonId, manualStartButtonId, increaseButtonId, decreaseButtonId) {
    // Once manual start scrolling is called, set the stop countdown flag to false
    stopCountdownOperation = false;

    if (scrollingInProgressManualButton) {
        return;
    }
    scrollingInProgressManualButton = true;
    scrollingInProgressStartButton = false;

    showCountdown(() => {
        const iframe = document.getElementById(iframeId);
        const contentWindow = iframe.contentWindow;
        const audio = document.getElementById(backingTrackId);

        // Use the current speed if it exists, otherwise use the initial speed
        currentSpeed = currentSpeed || 0.1; // Set a default speed for manual scrolling

        // Start keeping track of the elapsed time, so pausing can resume at the same exact position
        let startTime = Date.now();

        // Function to perform the scrolling
        function scrollContent() {
            if (scrolling && !stopCountdownOperation) {
                currentScrollPosition += currentSpeed;
                contentWindow.scrollTo(0, currentScrollPosition);

                // Schedule the next scroll
                requestAnimationFrame(scrollContent);
            }
        }

        // Start the audio if it exists
        if (audio && !stopCountdownOperation) {
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
        Check if scrolling is active, and ensure the elapsed time is continuously updated
        The global variable "elapsedTime" is updated to keep track of the time when the 
        scrolling is paused.
        The new elapsedTime is the current time minus the start time, and is used to update the
        adjustedTime variable.
        updateElapsedTime is recursively called to keep track of the elapsed time while scrolling is true
        */
        function updateElapsedTime() {
            if (scrolling && !stopCountdownOperation) {
                elapsedTime += Date.now() - startTime;
                startTime = Date.now();
                requestAnimationFrame(updateElapsedTime);
            }
        }
        updateElapsedTime();
    });

    enableButtons([increaseButtonId, decreaseButtonId]);
    disableButtons([startButtonId, manualStartButtonId]);
}

/**
 * increaseSpeed function
 * Increases the speed of the scrolling content by 0.1 units.
 * For use with manual scrolling only, as the speed is set to 0.1 units by default
 */
function increaseSpeed() {
    if (currentSpeed !== null) {
        currentSpeed += 0.1;
    }
}

/**
 * decreaseSpeed function
 * Decreases the speed of the scrolling content by 0.1 units.
 * For use with manual scrolling only, as the speed is set to 0.1 units by default
 */
function decreaseSpeed() {
    if (currentSpeed !== null && currentSpeed > 0.1) {
        currentSpeed -= 0.1;
    }
}

/**
 * disableButtons function
 * Disables the buttons with the specified IDs.
 * @param {*} buttonIds 
 */
function disableButtons(buttonIds) {
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = true;
        }
    });
}

/**
 * enableButtons function
 * Enables the buttons with the specified IDs.
 * @param {*} buttonIds 
 */
function enableButtons(buttonIds) {
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = false;
        }
    });
}

/**
 * toggleMute function
 * Toggles the mute state of the backing track audio element.
 * Also resumes the audio if it was paused.
 * @param {*} backingTrackId 
 */
function toggleMute(backingTrackId) {
    const audio = document.getElementById(backingTrackId);
    if (audio) {
        audio.muted = !audio.muted;
        const muteButton = document.querySelector(`[data-button-id="muteButton${backingTrackId.replace('audio', '')}"]`);
        if (audio.muted) {
            muteButton.textContent = 'Unmute';
        } else {
            muteButton.textContent = 'Mute';
        }
    }
}