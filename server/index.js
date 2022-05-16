const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const restaurantRoutes = require("./routes/restaurant.routes");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("HELLO WORLD!");
});

app.use("/restaurant", restaurantRoutes);

// /restaurant
//   GET :id
//   UPDATE :id

// GET /restaurant/:id
// GET /restaurant
// POST /restaurant
// PATCH /restaurant/:id
// DELETE /restaurant/:id

app.listen(4000, () => {
  console.log("Starting on port 4000");
});
