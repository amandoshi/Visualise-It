// import dependencies
const express = require("express");
const router = express.Router();

// pseudocode - GET
router.get("/pseudocode", (req, res) => {
	res.render("information/pseudocode.ejs");
});

// algorithms - GET
router.get("/algorithms", (req, res) => {
	res.render("information/algorithms.ejs");
});

// export routes
module.exports = router;
