import express from "express"; // Set up express
const app = express();
const port = 8080;
import path from "path"; // Set up path

let server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("To end the server, press 'CTRL+C'");
});

// Array of images
const images = [
  'random-images/grand-canyon.jpg',
  'random-images/half-dome.jpg',
  'random-images/mt-everest.jpg',
  'random-images/niagara-falls.jpg',
  'random-images/yellowstone.jpg',
  'random-images/zion-national-park.jpg'
];

// Required to show images
app.use(express.static('.'));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "random-button.html"));
});

// Endpoint to get a random image
// Will display a random image from the array of images
app.get('/random-image', (req, res) => {
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomIndex];
  res.json({ imageUrl: randomImage });
});
