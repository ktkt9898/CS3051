// Add event listener for the create user button
document.getElementById('add-user-btn').addEventListener('click', () => {
    // add-user-btn is the ID of the button to create a new user
    // retrieve the username from the input field
    const username = document.getElementById('username').value;

    // Check if the username is empty
    if (!username) {
        alert('Please enter a username.');
        return;
    }

    // Check if the username already exists
    fetch(`/users/${username}`)
        .then(response => {
            if (response.status === 404) {
                // Username does not exist, proceed to create the user
                // Response 404 means no user found, so we can create a new one
                // POST request sent to /users endpoint with the username
                return fetch('/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });
                // If 404 response, meaning OK, username already exists
            } else if (response.ok) {
                // Username already exists
                throw new Error('Username already exists');
            } else {
                throw new Error('Error checking username');
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.userID) {
                alert('Account created successfully!');
            } else if (data.error) {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            if (error.message === 'Username already exists') {
                alert('This username already exists. Please choose a different username.');
            } else {
                console.error('Error:', error);
                alert('An error occurred while creating the account.');
            }
        });
});

// Add event listener for the login button
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('login-username').value;

    // If not username was inputted, alert the user
    if (!username) {
        alert('Please enter your username.');
        return;
    }

    // POST request sent to /login endpoint with the username
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
    // Check if the response is OK (status code 200-299)
    // If not, throw an error with the response message
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to log in');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.userID) {
                console.log('Login successful, userID:', data.userID);
                alert('Login successful!');
                // Also load the favorites for the logged-in user
                loadFavorites(data.userID);
            }
        })
        .catch(error => console.error('Error logging in:', error));
});

/**
 * loadFavorites function
 * Fetches the user's favorite music tracks from the server and displays them in the UI.
 * @param {*} userID 
 */
function loadFavorites(userID) {
    console.log('Loading favorites for userID:', userID); // Debugging

    // Fetch request sent to /users/:userID/favorites endpoint to get the user's favorites
    // The user's favorites is stored in the database from the endpoint
    fetch(`/users/${userID}/favorites`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }
            return response.json();
        })
        // If response is OK, parse the JSON data and display it in the UI
        .then(favorites => {
            const favoritesList = document.getElementById('favorites-list');
            favoritesList.innerHTML = ''; // Clear the list before adding items

            // Check if the favorites array is empty
            // If empty, hide the favorites section
            if (favorites.length === 0) {
                document.getElementById('favorites-section').style.display = 'none';
                return;
            }

            // Iterate over the favorites array and create list items for each favorite
            favorites.forEach(favorite => {
                const listItem = document.createElement('li');

                // Create a link to the music page and set the track name as the link text
                const link = document.createElement('a');
                link.href = `music-pages/${favorite.musictrackID}.html`;

                // Set the track name as the link text
                link.textContent = favorite.musictrack; 

                // Once clicked, open the link in a new tab
                // This is done to prevent the user from being redirected away from the favorites page
                link.target = '_blank';

                // Add a "Remove" button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.style.marginLeft = '10px';
                removeButton.onclick = () => removeFavorite(userID, favorite.musictrackID, listItem);

                // Append the link and remove button to the list item
                listItem.appendChild(link);
                listItem.appendChild(removeButton);

                // Append the list item to the favorites list
                favoritesList.appendChild(listItem);
            });

            // Show the favorites section
            document.getElementById('favorites-section').style.display = 'block';
        })
        .catch(error => console.error('Error loading favorites:', error));
}

/**
 * removeFavorite function
 * Removes a favorite music track from the user's favorites list.
 * @param {*} userID 
 * @param {*} musictrackID 
 * @param {*} listItem 
 */
function removeFavorite(userID, musictrackID, listItem) {
    // Send a DELETE request to the server to remove the favorite
    // The request is sent to the /favorites endpoint with the userID and musictrackID in the body
    fetch(`/favorites`, {
        method: 'DELETE',
        
        // The request is sent to the /favorites endpoint with the userID and musictrackID in the body
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, musictrackID }),
    })
        .then(response => {
            if (response.ok) {
                // Remove the item from the UI
                listItem.remove();

                // Hide the favorites section if no items remain
                const favoritesList = document.getElementById('favorites-list');
                if (favoritesList.children.length === 0) {
                    document.getElementById('favorites-section').style.display = 'none';
                }
            } else {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to remove favorite');
                });
            }
        })
        .catch(error => alert(`Error: ${error.message}`));
}