const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();


// ✅ Create a new lead
router.post("/", async (req, res) => {
  const lead = await Lead.create(req.body);
  res.json(lead);
});


// ✅ Get all leads
router.get("/", async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});


// ✅ Update lead status + notes
router.put("/:id", async (req, res) => {
  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedLead);
});


// ✅ Delete lead
router.delete("/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Lead deleted successfully" });
});

module.exports = router;
