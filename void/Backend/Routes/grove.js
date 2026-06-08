const express = require("express");
const router = express.Router();
const { getGrove } = require("../Controllers/grove.controller");

router.get("/:signal", getGrove);

module.exports = router;
