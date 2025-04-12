import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

import sqlite3 from "sqlite3"; // Set up sqlite3
sqlite3.verbose(); // Set up verbose
import { open } from "sqlite"; // Set up open

// Authenticate with JWT
// Assumes a SQLite database with a users table
// with name and password_hash columns

import bcrypt from "bcrypt"; // https://www.npmjs.com/package/bcrypt
import jwt from "jsonwebtoken"; // https://www.npmjs.com/package/jsonwebtoken

// you can create a private key in node with the one-line script: require("crypto").randomBytes(64).toString("hex")
const algo = 'HS256';
const privateKey = "25377fdf7ead4a4edc5546c328bcec43a6c5c314339779b89dea9221911ec8947fa01d286793976f115f7d25cada65918557b5fd8ced102ddd4a98c59ce65d34";
const publicKey = privateKey;  // for symetric encryption, the public key is the same as the private key
const keyTimeout = "10m"; // 10 minutes

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

// The default route
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "login.html"));
});

// The route for the login page
app.get("/favorites", (req, res) => {
    res.sendFile(path.join(process.cwd(), "favorites.html"));
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
app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the user into the database
        const query = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
        db.run(query, [username, passwordHash], function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Failed to create account' });
            }
            res.status(201).json({ userID: this.lastID, username });
        });
    } catch (error) {
        console.error('Error hashing password:', error.message);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Log in a user and display their favorites
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = `SELECT userID, password_hash FROM users WHERE username = ?`;
    db.get(query, [username], async (err, row) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Failed to log in' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        try {
            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, row.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Generate a JWT token with a 10-minute expiration
            const token = jwt.sign({ userID: row.userID }, privateKey, { algorithm: algo, expiresIn: keyTimeout });

            // Log the token to the console
            console.log(`Generated JWT Token: ${token}`);

            res.json({ token });
        } catch (error) {
            console.error('Error verifying password:', error.message);
            res.status(500).json({ error: 'Failed to log in' });
        }
    });
});

// Middleware to authenticate requests
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.userID = decoded.userID; // Attach userID to the request
        next();
    });
}

// Add a favorite music track for a user
app.post('/favorites', authenticate, (req, res) => {
    const { musictrackID, musictrack } = req.body;
    const userID = req.userID; // Get userID from the authenticated request

    if (!musictrackID || !musictrack) {
        return res.status(400).json({ error: 'Missing required fields: musictrackID or musictrack' });
    }

    const checkQuery = `SELECT * FROM favorites WHERE userID = ? AND musictrackID = ?`;
    db.get(checkQuery, [userID, musictrackID], (err, row) => {
        if (err) {
            console.error('Error checking for duplicate favorite:', err.message);
            return res.status(500).json({ error: 'Failed to check for duplicate favorite' });
        }

        if (row) {
            return res.status(400).json({ error: 'This track is already in your favorites' });
        }

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

// Get user details by userID
app.get('/users/:userID', (req, res) => {
    const { userID } = req.params;

    // Convert userID to an integer
    const numericUserID = parseInt(userID, 10);

    // Check if the userID is valid
    if (isNaN(numericUserID)) {
        return res.status(400).json({ error: 'Invalid userID' });
    }

    // Query the database for the user
    const query = `SELECT * FROM users WHERE userID = ?`;
    db.get(query, [numericUserID], (err, row) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user details
        res.json(row);
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
app.delete('/favorites', authenticate, (req, res) => {
    const { musictrackID } = req.body;
    const userID = req.userID; // Get userID from the authenticated request

    if (!musictrackID) {
        return res.status(400).json({ error: 'Missing required field: musictrackID' });
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

// Information about the server
let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });