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

// Add a favorite music track for a user
app.post('/favorites', (req, res) => {
    const { userID, musictrackID, musictrack } = req.body;

    if (!userID || !musictrackID || !musictrack) {
        return res.status(400).json({ error: 'Missing required fields: userID, musictrackID, or musictrack' });
    }

    addFavorite(userID, musictrackID, musictrack, (err, favorite) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(favorite);
    });
});

// Get all favorites for a user by username
app.get('/users/:username/favorites', (req, res) => {
    const { username } = req.params;

    const query = `
        SELECT f.musictrackID, f.musictrack
        FROM favorites f
        JOIN users u ON f.userID = u.userID
        WHERE u.username = ?
    `;

    db.all(query, [username], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });