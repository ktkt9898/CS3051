document.getElementById('add-user-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;

    if (!username) {
        alert('Please enter a username.');
        return;
    }

    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
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
            console.error('Error:', error);
            alert('An error occurred while creating the account.');
        });
});

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('login-username').value;

    // Simulate login by fetching the user's favorites
    fetch(`/users/${username}/favorites`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('User not found or error fetching favorites.');
                return;
            }

            // Display the favorites section
            const favoritesSection = document.getElementById('favorites-section');
            const favoritesList = document.getElementById('favorites-list');
            favoritesList.innerHTML = ''; // Clear previous favorites
            favoritesSection.style.display = 'block';

            // Populate the favorites list
            data.forEach(favorite => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/music-pages/${favorite.musictrackID}.html`;
                link.textContent = favorite.musictrack;
                listItem.appendChild(link);
                favoritesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
});