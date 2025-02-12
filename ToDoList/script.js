function addTask() {
    let task = document.getElementById('task').value;
    let ul = document.getElementById('taskListID');
    let li = document.createElement('li');
    
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(task));
    ul.appendChild(li);
    
    document.getElementById('task').value = '';
}