import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

/* ============================
   GET ALL LEADS
============================ */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM leads");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
});

/* ============================
   ADD NEW LEAD
============================ */
router.post("/", async (req, res) => {
  const { name, email, source } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO leads (name, email, source) VALUES (?, ?, ?)",
      [name, email, source]
    );

    res.status(201).json({
      message: "✅ Lead added successfully",
      leadId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding lead", error });
  }
});

/* ============================
   UPDATE LEAD STATUS + NOTES
============================ */
router.put("/:id", async (req, res) => {
  const { status, notes } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE leads SET status = ?, notes = ? WHERE id = ?",
      [status, notes, id]
    );

    res.json({ message: "✅ Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error });
  }
});

/* ============================
   DELETE LEAD
============================ */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM leads WHERE id = ?", [id]);
    res.json({ message: "✅ Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error });
  }
});

export default router;
