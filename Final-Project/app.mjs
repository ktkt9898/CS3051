import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

import sqlite3 from "sqlite3"; // Set up sqlite3
sqlite3.verbose(); // Set up verbose
import { open } from "sqlite"; // Set up open

// Open a new database connection
async function openDb() {
    return await open({
        filename: 'databse.db',
        driver: sqlite3.Database
    });
}
let database = null;
openDb()
    .then((result) => {
        database = result;
        console.log("Database opened");
    })
    .catch((error) => {
        console.error(err);
        return {};
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

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });