import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Trainer = sequelize.define("Trainer", {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: "trainers",
});

export default Trainer;
