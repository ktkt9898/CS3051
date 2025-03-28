function addTask() {
    // Retrieve the task from the input field
    let task = document.getElementById('task').value;

    // Retrieve the unordered list, to be used along with the task
    let unorderedList = document.getElementById('taskListID');

    // Create a list element, later will be appended to the unordered list
    let listElement = document.createElement('li');
    
    // Create a checkbox, to be used along with the task
    let checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = 'checkBox';
    checkBox.className = 'checkBox';
    checkBox.onclick = function() {
        if (checkBox.checked) {
            listElement.style.textDecoration = 'line-through';
        } else {
            listElement.style.textDecoration = 'none';
        }
    }

    // Create a delete button, to be used along with the task
    let deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = "X";
    deleteButton.onclick = function() {
        unorderedList.removeChild(listElement);
    }
    
    // Append the checkbox first, then the task, and finally the delete button
    listElement.appendChild(checkBox);
    listElement.appendChild(document.createTextNode(task));
    listElement.appendChild(deleteButton);
    unorderedList.appendChild(listElement);
    
    // Clear the input field after adding the task
    document.getElementById('task').value = '';

    // Autofocus on the input field again
    document.getElementById('task').focus();
}

document.getElementById('task').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        addTask();
    }
});