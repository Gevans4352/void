const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./Routes/auth");
const fragmentRoutes = require("./Routes/fragments");
const constellationRoutes = require("./Routes/constellations");
const groveRoutes = require("./Routes/grove");
const carouselRoutes = require("./Routes/carousel");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/fragments", fragmentRoutes);
app.use("/api/constellations", constellationRoutes);
app.use("/api/grove", groveRoutes);
app.use("/api/carousel", carouselRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Void API is alive" });
});

module.exports = app;
