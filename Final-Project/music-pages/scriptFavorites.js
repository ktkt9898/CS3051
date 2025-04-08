/**
 * addToFavorites function
 * Adds a music track to the user's favorites list.
 * @param {*} userID 
 * @param {*} musictrackID 
 * @param {*} musictrack 
 * @returns 
 */
function addToFavorites(userID, musictrackID, musictrack) {
    // Convert userID to an integer
    const numericUserID = parseInt(userID, 10);

    // Check if all required parameters are provided
    if (!numericUserID || !musictrackID || !musictrack) {
        alert('All parameters (userID, musictrackID, musictrack) are required.');
        return;
    }

    // Step 1: Check if the user exists in the database
    fetch(`http://localhost:8080/users/${numericUserID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(user => {
            console.log(`User found: ${user.username}`); // Optional: Log user details for debugging

            // Step 2: Check if the track is already in the user's favorites
            fetch(`http://localhost:8080/users/${numericUserID}/favorites`)
                .then(response => response.json())
                .then(favorites => {
                    const isDuplicate = favorites.some(favorite => favorite.musictrackID === musictrackID);

                    if (isDuplicate) {
                        alert('This track is already in your favorites.');
                        return;
                    }

                    // Step 3: Add the track to the user's favorites
                    fetch('http://localhost:8080/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userID: numericUserID,
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
        })
        .catch(error => {
            console.error('Error:', error);
            alert('The user ID does not exist. Please check and try again.');
        });
}

/**
 * promptForUserIDAndAddToFavorites function
 * Prompts the user for their userID and adds the music track to their favorites.
 * @param {*} musictrackID 
 * @param {*} musictrack 
 * @returns 
 */
function promptForUserIDAndAddToFavorites(musictrackID, musictrack) {
    // Prompt the user for their userID
    const userID = prompt('Please enter your User ID:');

    // Check if the user provided a valid userID
    if (!userID) {
        alert('User ID is required to add a favorite.');
        return;
    }

    // Call the addToFavorites function with the provided userID
    addToFavorites(userID, musictrackID, musictrack);
}