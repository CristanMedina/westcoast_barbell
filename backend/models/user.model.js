import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Trainer from "./trainer.model.js";

const User = sequelize.define("User", {
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  date_of_birth: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.ENUM("M", "F"), allowNull: false },
  training_type: {
    type: DataTypes.ENUM(
      "strength",
      "hypertrophy",
      "weight_loss",
      "lifestyle",
      "functional",
      "athlete",
      "rehabilitation"
    ),
    allowNull: false,
  },
  allergy: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  allergy_details: { type: DataTypes.STRING, allowNull: true },
  illness: { type: DataTypes.STRING, allowNull: true },
  signed_rules: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  join_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  observations: { type: DataTypes.STRING(100), allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },

  assigned_trainer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "trainers",
      key: "id",
    },
  },
});

User.belongsTo(Trainer, { foreignKey: "assigned_trainer_id", as: "assigned_trainer" });
Trainer.hasMany(User, { foreignKey: "assigned_trainer_id", as: "clients" });

export default User;
