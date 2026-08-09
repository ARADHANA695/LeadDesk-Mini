const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead
} = require("../controllers/leadController");

// Create Lead
router.post("/", createLead);

// Get All Leads
router.get("/", getLeads);

// Update Lead Status
router.put("/:id", updateLeadStatus);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;