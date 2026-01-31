import express from "express";
import bcrypt from "bcrypt"; // for password hashing

const router = express.Router();

// Temporary "admin" credentials (hash the password for security)
const ADMIN_USER = "admin";

// Use the hash you just generated
const ADMIN_PASSWORD_HASH = "$2b$10$mZDtXgVZBgDyNr5xUMDVz.DSMGbfTWA6KyU8axNBMMUl4201S3M8C";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check username
    if (username !== ADMIN_USER) {
      return res.status(401).json({ message: "Invalid username" });
    }

    // Check password
    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // For simplicity, return a "loggedIn" flag (in real apps use JWT)
    res.json({ message: "✅ Login successful", loggedIn: true });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export default router;
