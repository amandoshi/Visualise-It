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

// export routes
module.exports = router;
