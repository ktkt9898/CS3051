import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

import sqlite3 from "sqlite3"; // Set up sqlite3
sqlite3.verbose(); // Set up verbose
import { open } from "sqlite"; // Set up open

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
  });

// Open a new database connection
async function openDb() {
    return await open({
        filename: 'tododatabase.db',
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
        console.error(error);
        return {};
    });

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "userlogin.html"));
});

app.post("/add-user", async (req, res) => {
    const { name } = req.body;
    if (!name) {
        console.log("Name is missing in the request body.");
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        console.log(`Adding user: ${name}`);
        const result = await database.run("INSERT INTO users (name) VALUES (?)", [name]);
        console.log(`User added with ID: ${result.lastID}`);
        res.json({ id: result.lastID, name });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
    }
});

app.get("/list-users", async (req, res) => {
    try {
        const users = await database.all("SELECT * FROM users");
        res.json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

// Add a task for a specific user
app.post("/add-task", async (req, res) => {
    const { userId, task } = req.body;
    if (!userId || !task) {
        return res.status(400).json({ error: "User ID and task are required" });
    }

    try {
        const result = await database.run("INSERT INTO tasks (user_id, task) VALUES (?, ?)", [userId, task]);
        res.json({ id: result.lastID, userId, task });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ error: "Failed to add task" });
    }
});

// Get tasks for a specific user
app.get("/get-tasks/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await database.all("SELECT * FROM tasks WHERE user_id = ?", [userId]);
        res.json(tasks);
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});