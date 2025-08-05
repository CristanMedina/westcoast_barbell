import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Company = sequelize.define("Company", {
  name: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: false },
  rfc: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  website: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "company",
});

export default Company;
