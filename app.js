// import dependencies
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const session = require("express-session");

// initialise express app
const app = express();

// view engine
app.set("view engine", "ejs");

// directory for static files
app.use(express.static(path.join(__dirname, "public")));

// favicon
app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));

// parse HTML form
app.use(express.urlencoded({ extended: true }));

// prase JSON bodies (as sent by API clients)
app.use(express.json());

// express-sessions
app.use(
	session({
		secret: "secret-key",
		resave: false,
		saveUninitialized: false,
	})
);

// sweet alerts - allow public access
app.use(
	"/swal",
	express.static(path.join(__dirname, "/node_modules/sweetalert2"))
);

// cytoscape modules - allow public access
app.use(
	"/cytoscape",
	express.static(path.join(__dirname, "/node_modules/cytoscape"))
);
app.use(
	"/cytoscape-fcose",
	express.static(path.join(__dirname, "/node_modules/cytoscape-fcose"))
);
app.use(
	"/layout-base",
	express.static(path.join(__dirname, "node_modules/layout-base"))
);
app.use(
	"/cose-base",
	express.static(path.join(__dirname, "node_modules/cose-base"))
);

// define routes
app.use("/", require("./routes/homepage"));
app.use("/information", require("./routes/information"));
app.use("/input", require("./routes/input"));
app.use("/visualise", require("./routes/visualise"));

// 404 route
app.use("*", require("./routes/404"));

// listen for requests
app.listen(3000, () => {
	console.log("Listening on port 3000: http://localhost:3000");
});
