// import dependencies
const express = require("express");
const router = express.Router();

// type - GET
router.get("/", (req, res) => {
	res.render("input/type.ejs");
});

// custom:type - GET
router.get("/custom", (req, res) => {
	res.render("input/custom/type.ejs");
});

// custom:type - POST
router.post("/custom", (req, res) => {
	req.session.directed = req.body.directed;
	req.session.weighted = req.body.weighted;

	// redirect page
	res.redirect(`/input/custom/${req.body.type}`);
});

// custom:edge list - GET
router.get("/custom/edgeList", (req, res) => {
	if (!req.session.directed || !req.session.weighted) {
		return res.redirect("/");
	}

	res.render("input/custom/edgeList.ejs", {
		directed: req.session.directed,
		weighted: req.session.weighted,
	});
});

// custom:adjacency list - GET
router.get("/custom/adjacencyList", (req, res) => {
	if (!req.session.directed || !req.session.weighted) {
		return res.redirect("/");
	}

	res.render("input/custom/nodeName.ejs", {
		postUrl: "/input/custom/adjacencyList",
	});
});

// custom:adjacency list - POST
router.post("/custom/adjacencyList", (req, res) => {
	req.session.nodeNames = req.body.names;

	res.redirect("/input/custom/adjacencyList/graph");
});

// custom:adjacency list:graph - GET
router.get("/custom/adjacencyList/graph", (req, res) => {
	if (
		!req.session.directed ||
		!req.session.weighted ||
		!req.session.nodeNames
	) {
		return res.redirect("/");
	}

	res.render("input/custom/adjacencyList.ejs", {
		directed: req.session.directed,
		nodeNames: req.session.nodeNames,
		weighted: req.session.weighted,
	});
});

// custom:adjacency matrix - GET
router.get("/custom/adjacencyMatrix", (req, res) => {
	if (!req.session.directed || !req.session.weighted) {
		return res.redirect("/");
	}

	res.render("input/custom/nodeName.ejs", {
		postUrl: "/input/custom/adjacencyMatrix",
	});
});

// custom:adjacency matrix - POST
router.post("/custom/adjacencyMatrix", (req, res) => {
	req.session.nodeNames = req.body.names;

	res.redirect("/input/custom/adjacencyMatrix/graph");
});

// custom:adjacency matrix:graph - GET
router.get("/custom/adjacencyMatrix/graph", (req, res) => {
	if (
		!req.session.directed ||
		!req.session.weighted ||
		!req.session.nodeNames
	) {
		return res.redirect("/");
	}

	res.render("input/custom/adjacencyMatrix", {
		directed: req.session.directed,
		nodeNames: req.session.nodeNames,
		weighted: req.session.weighted,
	});
});

// random - GET
router.get("/random", (req, res) => {
	res.render("input/random/random.ejs");
});

// upload - GET
router.get("/upload", (req, res) => {
	res.render("input/upload/csv.ejs");
});

// export all routes
module.exports = router;
