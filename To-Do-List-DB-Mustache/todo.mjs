// Node Setup
import express from "express";
const app = express();
const port = 8080;
import path from "path";

// SQLite 3 Setup
import sqlite3 from "sqlite3";
sqlite3.verbose();
import { open } from "sqlite";

// Mustache Server Setup
import mustacheExpress from "mustache-express"; 
const Mustache = mustacheExpress();
app.engine('mst', Mustache);
app.set('views', path.join(process.cwd(), 'templates')) 
app.set('view engine', 'mst');

// Route to render the task list
app.get("/tasklist", async (req, res) => {
    const userId = 1;
    try {
        const tasks = await database.all("SELECT task FROM tasks WHERE user_id = ?", [userId]);
        // Render the task list using Mustache
        res.render("tasklist", { tasks });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Failed to load tasks.");
    }
});

// Database Render
let database;

// Open a new database connection
async function openDb() {
    const db = await open({
        filename: 'tododatabase.db',
        driver: sqlite3.Database
    });

    console.log("Database connection opened.");
    return db;
}

// Initialize the database connection when the server starts
(async () => {
    database = await openDb();
    console.log("Database connection established.");
})();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "userlogin.html"));
});

// Functionality to create a new user in the database
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

// Functionality to retrieve all users from the database
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

let server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("To end the server, press 'CTRL+C'");
});

// Functionality to delete a task from the database
app.delete("/delete-task/:taskId", async (req, res) => {
    const { taskId } = req.params;

    try {
        const result = await database.run("DELETE FROM tasks WHERE id = ?", [taskId]);
        if (result.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});