
let buttonSequence = ""; // String variable to keep track of the button sequence

function buttonClick(button) {
    if (button && buttonSequence.length < 4) {
        button.style.backgroundColor = "green";
        buttonSequence += button.textContent; // Append the button's text content (1, 2, or 3)
        
        // Reset the button's background color after a short delay (e.g., 500ms)
        setTimeout(function() {
            button.style.backgroundColor = "";
        }, 500);

        // Update the entry box with the current button sequence
        document.getElementById("entryBox").textContent = buttonSequence;
    }
}

function checkButtons() {
    const correctSequence = "9898"; // The correct sequence to open the door

    // Check if the sequence matches the correct sequence
    if (buttonSequence === correctSequence) {
        document.getElementById("panelMessage").textContent = "The door is open!";
        document.getElementById("doorImage").src = "doorOpen.png";
        disableButtons();
    } else {
        // Reset the sequence if the sequence is incorrect
        buttonSequence = "";
        // Reset button colors
        const buttons = document.querySelectorAll(".codeButton button");
        buttons.forEach(function(button) {
            button.style.backgroundColor = "";
        });
        // Reset the entry box
        document.getElementById("entryBox").textContent = buttonSequence;
        // Update the panel message to indicate the sequence was incorrect
        document.getElementById("panelMessage").textContent = "Incorrect. Input 9898";
    }
}

function resetButtons() {
    // Clear the button sequence
    buttonSequence = "";
    // Reset button colors
    const buttons = document.querySelectorAll(".codeButton");
    buttons.forEach(function(button) {
        button.style.backgroundColor = "";
        button.disabled = false; // Enable the buttons
    });
    // Reset the entry box
    document.getElementById("entryBox").textContent = buttonSequence;
    // Reset the door image if it is currently doorOpen.png
    const doorImage = document.getElementById("doorImage");
    if (doorImage.src.includes("doorOpen.png")) {
        doorImage.src = "doorClosed.png";
    }
    // Reset the panel message
    document.getElementById("panelMessage").textContent = "Enter 9898";
}

function disableButtons() {
    const buttons = document.querySelectorAll(".codeButton");
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}