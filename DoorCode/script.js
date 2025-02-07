
let buttonSequence = ""; // String variable to keep track of the button sequence

function buttonClick(button) {
    if (button) {
        button.style.backgroundColor = "green";
        buttonSequence += button.textContent; // Append the button's text content (1, 2, or 3)
    }
    // Verify if true for the checkButtons method, which will change the message */
    checkButtons();
}

function checkButtons() {
    const correctSequence = "321"; // The correct sequence to open the door

    // Check if the sequence matches the correct sequence */
    // If the buttonSequence is exactly "321", the function will return true */
    if (buttonSequence === correctSequence) {
        document.getElementById("threeButtons").textContent = "The door is open!";
        document.getElementById("doorImage").src = "doorOpen.png";
        disableButtons(); // Disable the buttons after the door is open
    } else if (buttonSequence.length >= correctSequence.length) {
        // Reset the sequence if the length exceeds the correct sequence length
        buttonSequence = "";
        // Reset button colors
        const buttons = document.querySelectorAll(".codeButton button");
        // If the else condition is checked, reset to a blank background color
        buttons.forEach(button => button.style.backgroundColor = "");
    }
}

function disableButtons() {
    // Store each of the buttons in the buttons variable, regardless of the correct choice
    const buttons = document.querySelectorAll(".codeButton button");
    // Disable each button in the buttons variable
    buttons.forEach(function(button) {
        button.disabled = true;
    });
}