function addToFavorites(userID, musictrackID, musictrack) {
    if (!userID || !musictrackID || !musictrack) {
        alert('All parameters (userID, musictrackID, musictrack) are required.');
        return;
    }

    console.log('Checking if the track is already in favorites:', { userID, musictrackID });

    // Check if the track is already in the user's favorites
    fetch(`http://localhost:8080/users/${userID}/favorites`)
        .then(response => response.json())
        .then(favorites => {
            const isDuplicate = favorites.some(favorite => favorite.musictrackID === musictrackID);

            if (isDuplicate) {
                alert('This track is already in your favorites.');
                return;
            }

            // If not a duplicate, proceed to add the favorite
            console.log('Sending request to add favorite:', { userID, musictrackID, musictrack });

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