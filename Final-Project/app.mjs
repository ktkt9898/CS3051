import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

import sqlite3 from "sqlite3"; // Set up sqlite3
sqlite3.verbose(); // Set up verbose
import { open } from "sqlite"; // Set up open

// Open the SQLite database
const db = new sqlite3.Database('./userdatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Serve static files from the current working directory
app.use(express.static(path.join(process.cwd()))); 

// Parse JSON request bodies
app.use(express.json()); 

// The default route for the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "home.html"));
});

// The route for the login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(process.cwd(), "login.html"));
});

// The route for the music catalog page
app.get('/catalog', (req, res) => {
    res.sendFile(path.join(process.cwd(), "catalog.html"));
});

// The route for the music gear page
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(process.cwd(), "gallery.html"));
});

// Add a new user
app.post('/users', (req, res) => {
    const { username } = req.body;

    // Check if the username is provided
    // If not, return a 400 Bad Request response with an error message
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Check if the username already exists in the database
    // If it does, return a 400 Bad Request response with an error message
    const query = `INSERT INTO users (username) VALUES (?)`;
    db.run(query, [username], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: 'Failed to create account' });
        }
        res.status(201).json({ userID: this.lastID, username });
    });
});

// Log in a user and display their favorites
app.post('/login', (req, res) => {
    const { username } = req.body;

    // Check if the username is provided
    // If not, return a 400 Bad Request response with an error message
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Check if the user exists in the database
    // If not, return a 404 Not Found response with an error message
    const query = `SELECT userID FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Failed to log in' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the userID as JSON
        res.json({ userID: row.userID });
    });
});

// Add a favorite music track for a user
app.post('/favorites', (req, res) => {
    const { userID, musictrackID, musictrack } = req.body;

    // Check if the required fields are provided in the request body
    // If not, return a 400 Bad Request response with an error message
    if (!userID || !musictrackID || !musictrack) {
        console.error('Missing required fields in the request body.');
        return res.status(400).json({ error: 'Missing required fields: userID, musictrackID, or musictrack' });
    }

    // Check if the favorite already exists
    // If it does, return a 400 Bad Request response with an error message
    // If not, insert the new favorite into the database
    const checkQuery = `SELECT * FROM favorites WHERE userID = ? AND musictrackID = ?`;
    db.get(checkQuery, [userID, musictrackID], (err, row) => {
        if (err) {
            console.error('Error checking for duplicate favorite:', err.message);
            return res.status(500).json({ error: 'Failed to check for duplicate favorite' });
        }

        if (row) {
            // Duplicate found
            return res.status(400).json({ error: 'This track is already in your favorites' });
        }

        // If no duplicate, insert the new favorite
        const insertQuery = `INSERT INTO favorites (userID, musictrackID, musictrack) VALUES (?, ?, ?)`;
        db.run(insertQuery, [userID, musictrackID, musictrack], function (err) {
            if (err) {
                console.error('Error inserting favorite into the database:', err.message);
                return res.status(500).json({ error: 'Failed to add favorite' });
            }
            res.status(201).json({ favoriteID: this.lastID });
        });
    });
});

// Get all favorite music tracks for a user
// This endpoint retrieves all favorite music tracks for a specific user
app.get('/users/:userID/favorites', (req, res) => {
    const { userID } = req.params;

    const query = `
        SELECT musictrackID, musictrack
        FROM favorites
        WHERE userID = ?
    `;

    db.all(query, [userID], (err, rows) => {
        if (err) {
            console.error('Error fetching favorites:', err.message);
            return res.status(500).json({ error: 'Failed to fetch favorites' });
        }
        res.json(rows); // Send the rows as JSON
    });
});

// Delete a favorite music track for a user
// This endpoint deletes a specific favorite music track for a user
app.delete('/favorites', (req, res) => {
    const { userID, musictrackID } = req.body;

    // Check if the required fields are provided in the request body
    // If not, return a 400 Bad Request response with an error message
    if (!userID || !musictrackID) {
        return res.status(400).json({ error: 'Missing required fields: userID or musictrackID' });
    }

    // Check if the favorite exists
    // If it does, delete it from the database
    const deleteQuery = `DELETE FROM favorites WHERE userID = ? AND musictrackID = ?`;
    db.run(deleteQuery, [userID, musictrackID], function (err) {
        if (err) {
            console.error('Error deleting favorite:', err.message);
            return res.status(500).json({ error: 'Failed to delete favorite' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Favorite removed successfully' });
    });
});

// Information about the server
let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });

