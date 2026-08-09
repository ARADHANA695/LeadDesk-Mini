const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug Logs
    console.log("Email Entered:", email);
    console.log("Password Entered:", password);

    const admin = await Admin.findOne({ email });

    console.log("Admin Found:", admin);

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    console.log("Password Match:", match);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("✅ Login Successful");

    res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.log("Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
};