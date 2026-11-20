const express = require("express");
const router = express.Router();

const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

// Public route – customers can submit enquiries
router.post("/", createLead);

// Protected routes – admin must be logged in
router.get("/", authMiddleware, getLeads);
router.put("/:id", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;