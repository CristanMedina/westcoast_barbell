import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { updateUser, getUsers, assignTrainer } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", authenticate, getUsers);
router.put("/:id", authenticate, updateUser);
router.post("/assign-trainer", authenticate, assignTrainer);

export default router;
