// import dependencies
const express = require("express");
const router = express.Router();

// homepage - GET
router.get("/", (req, res) => {
	res.redirect("/input");
});

// export routes
module.exports = router;
