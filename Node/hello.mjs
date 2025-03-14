/**
 * Recommend to rename to .mjs
 * 
 * npm install -s express
 * npm ci (clean install)
 */

import express from "express"; // Set up express module
const app = express(); // Create an express function
const port = 8080; // 8080 is an alternative port to 80

let server = app.listen(port, function() {
    console.log("Server started on port " + port);
    console.log("To end press Ctrl+C");
});

// GET and POST are two common HTTP methods
// GET requests from the URL
// POST requests from the call
// REQ is data request, RES is needed to send data back
app.get("/", function(req, res) {
    res.send("Hello World!");
});

app.get("/myname", function(req, res) {
    res.send("Kyle");
});