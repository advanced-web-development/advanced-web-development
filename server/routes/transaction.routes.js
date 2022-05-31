const express = require("express");
const {
  getUserTransactionHistory,
} = require("../controllers/transaction.controller");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", requireAuth, getUserTransactionHistory);

module.exports = router;
