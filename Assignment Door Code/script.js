function buttonClick(button) {
    let startCount = 0;
    if (button.textContent === "1" || button.textContent === "2"
        || button.textContent === "3") {
        button.style.backgroundColor = "green";
    }
    /* Verify if true for the checkButtons method, which will change the message */
    checkButtons();
}

function checkButtons() {
    const buttons = document.querySelectorAll(".codeButton button");
    /* querySelectorAll stores all values of class .codeButton with the elements of type buttonm
    in the constant variable called buttons */
    function isButtonGreen(button) {
        /* Return true if the background color is equal to green */
        return button.style.backgroundColor === "green";
    }
    /* create an Array from the buttons ONLY if every button is green and the
    function isButtonGreen returned true */
    const allGreen = Array.from(buttons).every(isButtonGreen);

    /* Similarly, if allGreen was successfully created, change the message */
    if (allGreen) {
        document.getElementById("threeButtons").textContent = "The door is open!";
        document.getElementById("doorImage").src="doorOpen.png";
    }
}