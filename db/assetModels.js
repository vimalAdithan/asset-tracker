import { DataTypes } from "sequelize";
import { sequelize } from "./dbServer.js";
import { EmployeeModel, UserModel } from "./dbModels.js";

export const AssetModel = sequelize.define("Asset", {
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serialNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "other",
  },
  status: {
    type: DataTypes.ENUM("assigned", "returned", "scrapped"),
    defaultValue: "returned",
  },
});

AssetModel.belongsTo(EmployeeModel, {
  foreignKey: "currentUserId",
  as: "currentUser",
});

export const AssetHistoryModel = sequelize.define("AssetHistory", {
  action: {
    type: DataTypes.ENUM("assigned", "returned", "scrapped"),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

AssetHistoryModel.belongsTo(AssetModel, {
  foreignKey: "assetId",
  as: "asset",
});

AssetHistoryModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});

AssetHistoryModel.belongsTo(UserModel, {
  foreignKey: "masterId",
  as: "master",
});

await sequelize.sync({ alter: true });
