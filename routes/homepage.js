// import dependencies
const express = require("express");
const router = express.Router();

// homepage - GET
router.get("/", (req, res) => {
	res.render("homepage/homepage.ejs");
});

// export routes
module.exports = router;
