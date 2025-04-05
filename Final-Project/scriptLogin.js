document.getElementById('add-user-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;

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
                return fetch('/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username }),
                });
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

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('login-username').value;

    if (!username) {
        alert('Please enter your username.');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
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
                loadFavorites(data.userID); // Load the user's favorites
            }
        })
        .catch(error => console.error('Error logging in:', error));
});

function loadFavorites(userID) {
    console.log('Loading favorites for userID:', userID); // Debugging

    fetch(`/users/${userID}/favorites`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }
            return response.json();
        })
        .then(favorites => {
            console.log('Favorites fetched:', favorites); // Debugging

            const favoritesList = document.getElementById('favorites-list');
            favoritesList.innerHTML = ''; // Clear the list before adding items

            if (favorites.length === 0) {
                console.log('No favorites found for userID:', userID);
                document.getElementById('favorites-section').style.display = 'none';
                return;
            }

            favorites.forEach(favorite => {
                const listItem = document.createElement('li');

                // Create a link to the music page and set the track name as the link text
                const link = document.createElement('a');
                link.href = `music-pages/${favorite.musictrackID}.html`; // Adjust the path as needed
                link.textContent = favorite.musictrack; // Set the track name as the link text
                link.target = '_blank'; // Open the link in a new tab

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

function removeFavorite(userID, musictrackID, listItem) {
    fetch(`/favorites`, {
        method: 'DELETE',
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