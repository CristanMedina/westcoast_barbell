import Trainer from "../models/trainer.model.js";

export const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Error creating trainer", error: error.message });
  }
};

export const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trainers", error: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findByPk(trainerId);

    if (!trainer) return res.status(404).json({ message: "Trainer not found" });

    await trainer.update(req.body);

    res.status(200).json({ message: "Trainer updated successfully", trainer });
  } catch (error) {
    res.status(500).json({ message: "Error updating trainer", error: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    await trainer.destroy();
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trainer", error: error.message });
  }
};
