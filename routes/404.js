// import dependencies
const express = require("express");
const router = express.Router();

// 404 - GET
router.get("*", (req, res) => {
	res.render("404/404.ejs");
});

// export routes
module.exports = router;
