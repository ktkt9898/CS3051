document.addEventListener("DOMContentLoaded", () => {
    const addUserBtn = document.getElementById("add-user-btn");
    const addFavoriteBtn = document.getElementById("add-favorite-btn");
    const getFavoritesBtn = document.getElementById("get-favorites-btn");
    const outputDiv = document.getElementById("output");

    // Add User
    addUserBtn.addEventListener("click", async () => {
        const username = document.getElementById("username").value;

        if (!username) {
            alert("Please enter a username.");
            return;
        }

        try {
            const response = await fetch("/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await response.json();
            outputDiv.innerText = `User added: ${JSON.stringify(data)}`;
        } catch (error) {
            console.error("Error adding user:", error);
        }
    });

    // Add Favorite
    addFavoriteBtn.addEventListener("click", async () => {
        const userID = prompt("Enter the user ID:");
        const musictrackID = document.getElementById("musictrackID").value;
        const musictrack = document.getElementById("musictrack").value;

        if (!userID || !musictrackID || !musictrack) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userID, musictrackID, musictrack }),
            });

            const data = await response.json();
            outputDiv.innerText = `Favorite added: ${JSON.stringify(data)}`;
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    });

    // Get Favorites
    getFavoritesBtn.addEventListener("click", async () => {
        const userID = prompt("Enter the user ID:");

        if (!userID) {
            alert("Please enter a user ID.");
            return;
        }

        try {
            const response = await fetch(`/users/${userID}/favorites`);
            const data = await response.json();
            outputDiv.innerText = `Favorites: ${JSON.stringify(data)}`;
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    });
});