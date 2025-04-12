/**
 * addToFavorites function
 * Adds a music track to the user's favorites list.
 * @param {*} musictrackID 
 * @param {*} musictrack 
 * @returns 
 */
function addToFavorites(musictrackID, musictrack) {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found. User is not logged in.');
        alert('You must be logged in to add favorites.');
        return;
    }

    try {
        // Decode the token to extract the user ID (assuming the token is a JWT)
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
        const userID = payload.userID; // Adjust this based on your token structure

        if (!userID) {
            console.error('User ID not found in token.');
            alert('Invalid token. Please log in again.');
            return;
        }

        // Check if all required parameters are provided
        if (!musictrackID || !musictrack) {
            alert('All parameters (musictrackID, musictrack) are required.');
            return;
        }

        // Step 1: Check if the track is already in the user's favorites
        fetch(`http://localhost:8080/users/${userID}/favorites`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(favorites => {
                const isDuplicate = favorites.some(favorite => favorite.musictrackID === musictrackID);

                if (isDuplicate) {
                    alert('This track is already in your favorites.');
                    return;
                }

                // Step 2: Add the track to the user's favorites
                fetch('http://localhost:8080/favorites', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add Authorization header
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userID: userID,
                        musictrackID: musictrackID,
                        musictrack: musictrack,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.favoriteID) {
                            alert('Favorite added successfully!');
                        } else if (data.error) {
                            alert(`Error: ${data.error}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while adding to favorites.');
                    });
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
                alert('An error occurred while checking favorites.');
            });
    } catch (error) {
        console.error('Error decoding token:', error);
        alert('Invalid token. Please log in again.');
    }
}