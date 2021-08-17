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
	// store graph type in sessions
	req.session.directed = req.body.directed;
	req.session.weighted = req.body.weighted;

	// redirect page
	res.redirect(`/input/custom/${req.body.type}`);
});

// custom:edge list - GET
router.get("/custom/edgeList", (req, res) => {
	res.render("input/custom/edgeList.ejs", {
		directed: req.session.directed,
		weighted: req.session.weighted,
	});
});

// export routes
module.exports = router;
