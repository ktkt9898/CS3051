import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

let server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("To end the server, press 'CTRL+C'");
});

// Required to show pictures
app.use(express.static('.'));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "about-me-main.html"));
});

app.get("/favorites", (req, res) => {
  res.sendFile(path.join(process.cwd(), "contentFavorites.html"));
});

app.get("/list", (req, res) => {
  res.sendFile(path.join(process.cwd(), "contentList.html"));
});