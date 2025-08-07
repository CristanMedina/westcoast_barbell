import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { createTrainer, getTrainers, updateTrainer, deleteTrainer } from "../controllers/trainer.controller.js";

const router = express.Router();

router.get("/", authenticate, getTrainers);
router.post("/", authenticate, isAdmin, createTrainer);
router.put("/:id", authenticate, isAdmin, updateTrainer);
router.delete("/:id", authenticate, isAdmin, deleteTrainer);

export default router;
