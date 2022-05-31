const express = require("express");
const {
  createUser,
  signIn,
  getLoggedInUserData,
  createAdminUser,
} = require("../controllers/auth.controller");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// POST /auth/register
router.post("/register", createUser);

router.post("/sign-in", signIn);

router.get("/me", requireAuth, getLoggedInUserData);

router.post("/create", requireAdmin, createAdminUser);

module.exports = router;
