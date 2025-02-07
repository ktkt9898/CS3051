// String variable to keep track of the button sequence
let buttonSequence = "";

function buttonClick(button) {
    // Prevent the user from inputting more than 4 digits
    if (button && buttonSequence.length < 4) {
        button.style.backgroundColor = "green";
        // Append the button's text content (1, 2, etc.) to the button sequence.
        buttonSequence += button.textContent;
        
        // Reset the button's background color after a short delay
        setTimeout(function() {
            button.style.backgroundColor = "";
        }, 500);

        // Update the entry box with the current button sequence
        document.getElementById("entryBox").textContent = buttonSequence;
    }
}

function checkButtons() {
    // The correct sequence to open the door
    const correctSequence = "9898"; 

    // Check if the sequence matches the correct sequence
    if (buttonSequence === correctSequence) {
        document.getElementById("panelMessage").textContent = "The door is open!";
        document.getElementById("doorImage").src = "doorOpen.png";
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
        document.getElementById("panelMessage").textContent = "Try again!";
    }
}

function resetButtons() {
    // Reset the sequence
    buttonSequence = "";
    
    // Reset the entry box
    document.getElementById("entryBox").textContent = buttonSequence;

    // Reset the door image if it is currently doorOpen.png, in case of a successful code entry
    const doorImage = document.getElementById("doorImage");
    if (doorImage.src.includes("doorOpen.png")) {
        doorImage.src = "doorClosed.png";
    }
    // Reset the panel message
    document.getElementById("panelMessage").textContent = "Input 9898";
}