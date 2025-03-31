// function addTask() {
//     // Retrieve the task from the input field
//     let task = document.getElementById('task').value;

//     // Retrieve the unordered list, to be used along with the task
//     let unorderedList = document.getElementById('taskListID');

//     // Create a list element, later will be appended to the unordered list
//     let listElement = document.createElement('li');
    
//     // Create a checkbox, to be used along with the task
//     let checkBox = document.createElement('input');
//     checkBox.type = 'checkbox';
//     checkBox.id = 'checkBox';
//     checkBox.className = 'checkBox';
//     checkBox.onclick = function() {
//         if (checkBox.checked) {
//             listElement.style.textDecoration = 'line-through';
//         } else {
//             listElement.style.textDecoration = 'none';
//         }
//     }

//     // Create a delete button, to be used along with the task
//     let deleteButton = document.createElement('button');
//     deleteButton.id = 'deleteButton';
//     deleteButton.className = 'deleteButton';
//     deleteButton.textContent = "X";
//     deleteButton.onclick = function() {
//         unorderedList.removeChild(listElement);
//     }
    
//     // Append the checkbox first, then the task, and finally the delete button
//     listElement.appendChild(checkBox);
//     listElement.appendChild(document.createTextNode(task));
//     listElement.appendChild(deleteButton);
//     unorderedList.appendChild(listElement);
    
//     // Clear the input field after adding the task
//     document.getElementById('task').value = '';

//     // Autofocus on the input field again
//     document.getElementById('task').focus();
// }

// document.getElementById('task').addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         event.preventDefault(); // Prevent form submission
//         addTask();
//     }
// });

function addUser() {
    let name = document.getElementById('name').value;
    if (!name) {
        alert("Please enter a name.");
        return;
    }

    fetch('/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(response => response.json())
        .then(data => {
            alert(`User added with ID: ${data.id}`);
            listUsers();
        })
        .catch(error => console.error('Error adding user:', error));
}

function listUsers() {
    fetch('/list-users')
        .then(response => response.json())
        .then(data => {
            let usersDiv = document.getElementById('users');
            usersDiv.innerHTML = '';
            data.forEach(user => {
                let userElement = document.createElement('p');
                userElement.textContent = `${user.name} (ID: ${user.id})`;
                userElement.style.cursor = 'pointer';
                userElement.onclick = () => viewTasks(user.id, user.name);
                usersDiv.appendChild(userElement);
            });
        })
        .catch(error => console.error('Error listing users:', error));
}

function viewTasks(userId, userName) {
    fetch(`/get-tasks/${userId}`)
        .then(response => response.json())
        .then(data => {
            let tasksDiv = document.getElementById('tasks');
            tasksDiv.innerHTML = `<h3>Tasks for ${userName}</h3>`;
            let taskList = document.createElement('ul');
            data.forEach(task => {
                let taskItem = document.createElement('li');
                taskItem.textContent = task.task;
                taskList.appendChild(taskItem);
            });
            tasksDiv.appendChild(taskList);

            // Add a form to add new tasks for this user
            let taskForm = document.createElement('div');
            taskForm.innerHTML = `
                <input type="text" id="newTask" placeholder="New Task">
                <button onclick="addTask(${userId})">Add Task</button>
            `;
            tasksDiv.appendChild(taskForm);
        })
        .catch(error => console.error('Error retrieving tasks:', error));
}

function addTask(userId) {
    let task = document.getElementById('newTask').value;
    if (!task) {
        alert("Please enter a task.");
        return;
    }

    fetch('/add-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, task })
    })
        .then(response => response.json())
        .then(data => {
            alert(`Task added: ${data.task}`);
            viewTasks(userId, ""); // Refresh the task list
        })
        .catch(error => console.error('Error adding task:', error));
}