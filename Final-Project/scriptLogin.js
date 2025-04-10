// Add event listener for the create user button
document.getElementById('add-user-btn').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        document.getElementById('registration-error-message').textContent = 'Username and password are required.';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Account created successfully!');
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
        } else {
            document.getElementById('registration-error-message').textContent = data.error;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById('registration-error-message').textContent = 'An error occurred. Please try again.';
    }
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);

            // Redirect to the catalog page
            window.location.href = '/catalog';
        } else {
            // Display error message
            document.getElementById('error-message').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token'); // Clear the JWT token
    alert('You have been logged out.');
    window.location.href = '/login'; // Redirect to the login page
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