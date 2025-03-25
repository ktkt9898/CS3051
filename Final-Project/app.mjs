import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

let server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("To end the server, press 'CTRL+C'");
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