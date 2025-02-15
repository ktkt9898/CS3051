function addTask() {
    let task = document.getElementById('task').value;
    let unorderedList = document.getElementById('taskListID');
    let listElement = document.createElement('listElement');
    
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

    let deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = "X";
    deleteButton.onclick = function() {
        unorderedList.removeChild(listElement);
    }
    
    listElement.appendChild(checkBox);
    listElement.appendChild(document.createTextNode(task));
    listElement.appendChild(deleteButton);
    unorderedList.appendChild(listElement);
    
    document.getElementById('task').value = '';
}