
const mongoose = require("mongoose");
const Lead = require("../models/Lead");

// Create Lead
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source } = req.body;

    // Required field validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof company !== "string" ||
      typeof source !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !company.trim() ||
      !source.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided correctly.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Create lead
    const lead = await Lead.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      company: company.trim(),
      source: source.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      lead,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create Lead Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating lead.",
    });
  }
};

// Get All Leads with Pagination and Sorting
const getLeads = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const sortOrder = req.query.sort === "oldest" ? 1 : -1;

    const totalLeads = await Lead.countDocuments();
    const totalPages = Math.ceil(totalLeads / limit);

       const statusCounts = {
      New: await Lead.countDocuments({ status: "New" }),
      Contacted: await Lead.countDocuments({ status: "Contacted" }),
      Qualified: await Lead.countDocuments({ status: "Qualified" }),
      Lost: await Lead.countDocuments({ status: "Lost" }),
    };

    const leads = await Lead.find()
      .sort({ createdAt: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: leads.length,
      totalLeads,
      totalPages,
      currentPage: page,
      statusCounts,
      leads,
    });
  } catch (error) {
    console.error("Get Leads Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching leads.",
    });
  }
};

// Update Lead
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, source, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (source !== undefined) updateData.source = source;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided.",
      });
    }

    const lead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      lead,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating lead.",
    });
  }
};

// Delete Lead
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID.",
      });
    }

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting lead.",
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
};
