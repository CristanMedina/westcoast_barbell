import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import Trainer from "../models/trainer.model.js";
import { printTicket } from "../utils/ticketPrinter.js";

export const createPayment = async (req, res) => {
  try {
    const { userId, trainerId, amount, transactionType, weekDay } = req.body;

    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ message: "You can only create payments for yourself" });
    }

    const payment = await Payment.create({
      user_id: userId,
      trainer_id: trainerId,
      amount,
      transaction_type: transactionType,
      week_day: weekDay,
    });

    res.status(201).json({ message: "Payment recorded", payment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

export const printPaymentTicket = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await printTicket({
      userId: payment.user_id,
      trainerId: payment.trainer_id,
      amount: payment.amount,
      transactionType: payment.transaction_type,
      weekDay: payment.week_day,
    });

    res.json({ message: "Ticket printed" });
  } catch (error) {
    res.status(500).json({ message: "Error printing ticket", error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const where = req.user.role === "admin" ? {} : { user_id: req.user.id };

    const payments = await Payment.findAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["id", "first_name", "last_name"] },
        { model: Trainer, as: "trainer", attributes: ["id", "first_name", "last_name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};
