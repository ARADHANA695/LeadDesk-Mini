require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Admin.findOne({
      email: "admin@leaddesk.com",
    });

    if (existing) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      email: "admin@leaddesk.com",
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });