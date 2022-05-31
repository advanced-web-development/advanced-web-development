const express = require("express");
const {
  createUser,
  signIn,
  getLoggedInUserData,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/authMiddleware");
const router = express.Router();

// POST /auth/register
router.post("/register", createUser);

router.post("/sign-in", signIn);

router.get("/me", requireAuth, getLoggedInUserData);

module.exports = router;
