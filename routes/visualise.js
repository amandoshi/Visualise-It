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

// export routes
module.exports = router;
