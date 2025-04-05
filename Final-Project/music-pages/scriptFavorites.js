function addToFavorites(musictrackID) {
    const userID = 1; // Replace with the actual user ID from your authentication system
    const musictrack = "Come as You Are"; // Replace with the actual track name dynamically if needed

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
}