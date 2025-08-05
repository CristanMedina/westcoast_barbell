import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "vIZ32LEQgsz9yz8Dfq1Q9CqkQN9QR8FQziVUBUI1a9P2HfziKuePXpGOOgEMG8YvRAiD7d6dK27nwYBuzlPRHSf3hOMu6b4HifOCb56hLSXSEGrgIVflA7X6gwgr90CZUKqQl9wDJe4v7SBZjiuPt7GQFRdIzJQ9J6Iqmyum7ho47uW2VuubWphcyGTjQcfPID4a4s4ZJg4LvLpy8P2j2qyfhL1w849mW3DjduD41NdwVhz2PvbtDQOxuUBvSFK9";

export const signup = async (req, res) => {
  try {
    const { email, password, role, ...otherFields } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...otherFields,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: {
        model: Trainer,
        as: "assigned_trainer",
        attributes: ["first_name", "last_name"],
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};
