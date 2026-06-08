const express = require("express");
const router = express.Router();
const { getCurrentCarousel } = require("../Controllers/carousel.controller");

router.get("/current", getCurrentCarousel);

module.exports = router;
