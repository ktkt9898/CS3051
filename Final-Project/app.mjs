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

app.use(express.static(path.join(process.cwd()))); // Serve static files from the current working directory

app.use(express.json()); // Parse JSON request bodies

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(process.cwd(), "login.html"));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(process.cwd(), "catalog.html"));
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(process.cwd(), "gallery.html"));
});

// Add a new user
app.post('/users', (req, res) => {
    const { username } = req.body;

    if (!username) {
        console.error('Username is missing in the request body.');
        return res.status(400).json({ error: 'Username is required' });
    }

    const query = `INSERT INTO users (username) VALUES (?)`;
    db.run(query, [username], function (err) {
        if (err) {
            console.error('Error inserting user into the database:', err.message);
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: 'Failed to create account' });
        }
        console.log(`User created with ID: ${this.lastID}`);
        res.status(201).json({ userID: this.lastID, username });
    });
});

app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

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

    if (!userID || !musictrackID || !musictrack) {
        console.error('Missing required fields in the request body.');
        return res.status(400).json({ error: 'Missing required fields: userID, musictrackID, or musictrack' });
    }

    // Check if the favorite already exists
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
            console.log(`Favorite added with ID: ${this.lastID}`);
            res.status(201).json({ favoriteID: this.lastID });
        });
    });
});

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

        console.log('Favorites fetched for userID:', userID, rows); // Debugging
        res.json(rows); // Send the rows as JSON
    });
});

app.delete('/favorites', (req, res) => {
    const { userID, musictrackID } = req.body;

    if (!userID || !musictrackID) {
        return res.status(400).json({ error: 'Missing required fields: userID or musictrackID' });
    }

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

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });

