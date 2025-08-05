import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import User from "./user.model.js";
import Trainer from "./trainer.model.js";

const Payment = sequelize.define("Payment", {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  transaction_type: { type: DataTypes.ENUM("Efectivo", "Transferencia bancaria"), allowNull: false },
  week_day: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "payments",
});

Payment.belongsTo(User, { foreignKey: "user_id", as: "user" });
Payment.belongsTo(Trainer, { foreignKey: "trainer_id", as: "trainer" });

export default Payment;
