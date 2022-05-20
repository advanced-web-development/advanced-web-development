const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const restaurantRoutes = require("./routes/restaurant.routes");
const productRoutes = require("./routes/product.routes");
const productCategoryRoutes = require("./routes/productCategory.routes");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("HELLO WORLD!");
});

app.use("/restaurant", restaurantRoutes);
app.use("/product", productRoutes);
app.use("/productCategory", productCategoryRoutes);

// /restaurant
//   GET :id
//   UPDATE :id

// GET /restaurant/:id
// GET /restaurant => all restaurants
// POST /restaurant
// PATCH /restaurant/:id
// DELETE /restaurant/:id

app.listen(4000, () => {
  console.log("Starting on port 4000");
});
