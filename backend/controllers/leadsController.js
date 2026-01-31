import pool from "../config/db.js";

/**
 * GET all leads
 */
export const getLeads = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE a new lead
 */
export const createLead = async (req, res) => {
  const { name, email, source } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO leads (name, email, source) VALUES (?, ?, ?)",
      [name, email, source]
    );

    res.status(201).json({
      message: "Lead created successfully",
      leadId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE lead status + notes
 */
export const updateLead = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    await pool.query(
      "UPDATE leads SET status = ?, notes = ? WHERE id = ?",
      [status, notes, id]
    );

    res.json({ message: "Lead updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
