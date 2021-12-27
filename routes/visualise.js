// import dependencies
const express = require("express");
const router = express.Router();

// visualise - GET
router.get("/", (req, res) => {
	if (!req.session.weighted || !req.session.nodeNames || !req.session.matrix) {
		return res.redirect("/");
	}

	res.render("visualise/visualise", {
		weighted: req.session.weighted,
		nodeNames: req.session.nodeNames,
		matrix: req.session.matrix,
	});
});

// visualise - POST
router.post("/", (req, res) => {
	req.session.nodeNames = req.body.nodeNames;
	req.session.matrix = req.body.matrix;
	req.session.weighted = req.body.weighted;

	res.redirect("/visualise");
});

// distance table - GET
router.get("/distanceTable", (req, res) => {
	if (!req.query.data || !req.session.nodeNames) {
		return res.redirect("/");
	}

	res.render("visualise/distanceTable", {
		distanceTable: req.query.data,
		nodeNames: req.session.nodeNames,
	});
});

// export routes
module.exports = router;
