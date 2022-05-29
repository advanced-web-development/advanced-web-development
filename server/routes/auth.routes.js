const express = require("express");
const { createUser, signIn } = require("../controllers/auth.controller");
const router = express.Router();

// POST /auth/register
router.post("/register", createUser);

router.post("/sign-in", signIn);

module.exports = router;
