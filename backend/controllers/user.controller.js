import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";

export const assignTrainer = async (req, res) => {
  try {
    const { userId, trainerId } = req.body;

    const user = await User.findByPk(userId);
    const trainer = await Trainer.findByPk(trainerId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    user.assigned_trainer_id = trainer.id;
    await user.save();

    const updatedUser = await User.findByPk(user.id, {
      include: { model: Trainer, as: "assigned_trainer" },
      attributes: { exclude: ["password"] }
    });

    res.status(200).json({
      message: "Trainer assigned successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Error assigning trainer", error: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: { model: Trainer, as: "assigned_trainer" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin" && req.user.id !== +userId) {
      return res.status(403).json({ message: "You are not authorized to update this user" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, email, ...otherFields } = req.body;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ message: "Email is already registered" });
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    Object.entries(otherFields).forEach(([key, value]) => {
      if (value !== undefined) user[key] = value;
    });

    await user.save();

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: { model: Trainer, as: "assigned_trainer", attributes: ["first_name", "last_name"] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};
