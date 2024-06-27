const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { readdirSync } = require("fs");
const { inject } = require("@vercel/analytics");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

// Routes
readdirSync("./api/routes").map((r) => app.use("/", require("./routes/" + r)));

app.get("/", async (req, res) => {
  res.send("Welcome to offers listing app");
});

inject();

app.listen(process.env.PORT, () =>
  console.log("Server is running " + process.env.PORT)
);

module.exports = app;
