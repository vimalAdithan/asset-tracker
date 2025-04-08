import { DataTypes } from "sequelize";
import { sequelize } from "./dbServer.js";

export const UserModel = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EmployeeModel = sequelize.define(
  "Employee",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

await sequelize.sync({ alter: true });
