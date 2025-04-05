/**
 * addToFavorites function
 * Adds a music track to the user's favorites list.
 * @param {*} userID 
 * @param {*} musictrackID 
 * @param {*} musictrack 
 * @returns 
 */
function addToFavorites(userID, musictrackID, musictrack) {
    // Check if all required parameters are provided
    // If not, alert the user and return
    if (!userID || !musictrackID || !musictrack) {
        alert('All parameters (userID, musictrackID, musictrack) are required.');
        return;
    }

    // Check if the track is already in the user's favorites
    // Fetch request sent to /users/:userID/favorites endpoint to get the user's favorites
    // The user's favorites is stored in the database from the endpoint
    fetch(`http://localhost:8080/users/${userID}/favorites`)
        .then(response => response.json())
        .then(favorites => {
            // some() method tests whether at least one element in the array passes the test implemented by the provided function
            // In this case, it checks if the musictrackID of any favorite matches the one being added
            // If it is, alert the user and return
            const isDuplicate = favorites.some(favorite => favorite.musictrackID === musictrackID);

            if (isDuplicate) {
                alert('This track is already in your favorites.');
                return;
            }

            // If not a duplicate, proceed to add the favorite
            // Send a POST request to add the favorite to the database
            fetch('http://localhost:8080/favorites', {
                method: 'POST',
                headers: {
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