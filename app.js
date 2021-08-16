// import dependencies
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");

// initialise express app
const app = express();

// view engine
app.set("view engine", "ejs");

// directory for static files
app.use(express.static(path.join(__dirname, "public")));

// favicon
app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));

// define routes
app.use("/", require("./routes/homepage"));
app.use("/input", require("./routes/input"));

// 404 route
app.use("*", require("./routes/404"));

// listen for requests
app.listen(3000, () => {
	console.log("Listening on port 3000: http://localhost:3000");
});
