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

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "login.html"));
});

app.get('/catalog', (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "catalog.html"));
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "gallery.html"));
});

// Add a new user
app.post('/users', (req, res) => {
    const { username } = req.body;
    addUser(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(user);
    });
});

// Add a favorite music track for a user
app.post('/favorites', (req, res) => {
    const { userID, musictrackID, musictrack } = req.body;
    addFavorite(userID, musictrackID, musictrack, (err, favorite) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(favorite);
    });
});

// Get all favorites for a user
app.get('/users/:userID/favorites', (req, res) => {
    const { userID } = req.params;
    getFavoritesByUser(userID, (err, favorites) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(favorites);
    });
});

// Add a new user
function addUser(username, callback) {
    const query = `INSERT INTO users (username) VALUES (?)`;
    db.run(query, [username], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { userID: this.lastID, username });
    });
}

// Add a favorite music track for a user
function addFavorite(userID, musictrackID, musictrack, callback) {
    const query = `INSERT INTO favorites (userID, musictrackID, musictrack) VALUES (?, ?, ?)`;
    db.run(query, [userID, musictrackID, musictrack], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { favoriteID: this.lastID, userID, musictrackID, musictrack });
    });
}

// Get all favorites for a user
function getFavoritesByUser(userID, callback) {
    const query = `SELECT * FROM favorites WHERE userID = ?`;
    db.all(query, [userID], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
}

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });