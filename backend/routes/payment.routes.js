import express from "express";
import { createPayment, printPaymentTicket } from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", authenticate, createPayment);
router.post("/:id/print", authenticate, isAdmin, printPaymentTicket);

export default router;
