import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
      email, // ⭐ FIXED
      password: hashedPassword,
    });

    res.status(201).json({
      message: "✅ Admin Created",
      admin: { email: admin.email }, // ⭐ FIXED
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "4h" } // ⭐ 4 HOUR SESSION
    );

    res.json({
      message: "✅ Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
