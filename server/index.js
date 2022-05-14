const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.get("/", (req, res) => {
  res.send("HELLO WORLD!");
});

app.listen(4000, () => {
  console.log("Starting on port 4000");
});
