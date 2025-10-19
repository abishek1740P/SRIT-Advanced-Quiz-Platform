const mongoose = require("mongoose");
const User = require("./models/User");
const { JWT_SECRET, MONGODB_URI } = require("./config/env");

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const admin = new User({
      name: "System Administrator",
      email: "admin@sritcbe.ac.in",
      password: "qwerty123", // Will be hashed by the pre-save hook
      role: "admin"
    });

    await admin.save();
    console.log("Admin user created successfully");
    
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();