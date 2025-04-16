// Add event listener for the create user button
document.getElementById('add-user-btn').addEventListener('click', async () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    // Validate input fields
    // Check if username and password are provided
    if (!username || !password) {
        document.getElementById('registration-error-message').textContent = 'Username and password are required.';
        return;
    }

    // Check if username and password meet the length requirements
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

    // Validate input fields
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
            window.location.href = '/favorites'; // Redirect to the favorites page
        } else {
            // Display error message
            document.getElementById('error-message').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    }
});

/**
 * loadFavorites function
 * Fetches the user's favorite music tracks from the server and displays them in the UI.
 */
function loadFavorites() {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Check if the token exists
    // If the token does not exist, the user is not logged in
    if (!token) {
        console.error('No token found. User is not logged in.');
        document.getElementById('favorites-section').style.display = 'none';
        document.getElementById('no-favorites').style.display = 'none';
        return;
    }

    // Decode the JWT token to get the user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userID = payload.userID;

    // Send a GET request to the server to retrieve the user's favorites
    fetch(`/users/${userID}/favorites`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }
            return response.json();
        })
        .then(favorites => {
            const favoritesList = document.getElementById('favorites-list');

            // Clear the previous existing favorites list
            favoritesList.innerHTML = ''; 

            if (favorites.length === 0) {
                // Show "No Favorites" message if the list is empty
                document.getElementById('no-favorites').style.display = 'block';
                document.getElementById('favorites-section').style.display = 'none';
                return;
            }

            // Hide "No Favorites" message and display the favorites section
            document.getElementById('no-favorites').style.display = 'none';
            document.getElementById('favorites-section').style.display = 'block';

            favorites.forEach(favorite => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `music-pages/${favorite.musictrackID}.html`;
                link.textContent = favorite.musictrack;
                link.target = '_blank';

                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.style.marginLeft = '10px';
                removeButton.onclick = () => removeFavorite(favorite.musictrackID, listItem);

                listItem.appendChild(link);
                listItem.appendChild(removeButton);
                favoritesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading favorites:', error));
}

/**
 * removeFavorite function
 * Removes a favorite music track from the user's favorites list.
 * @param {*} musictrackID 
 * @param {*} listItem 
 */
function removeFavorite(musictrackID, listItem) {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Check if the token exists
    // If the token does not exist, the user is not logged in
    if (!token) {
        console.error('No token found. User is not logged in.');
        alert('You must be logged in to remove favorites.');
        return;
    }

    // Send a DELETE request to the server to remove the favorite
    fetch(`/favorites`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ musictrackID }), // Only send the musictrackID
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