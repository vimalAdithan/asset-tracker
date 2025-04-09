import jwt from "jsonwebtoken";
import { UserModel } from "../db/dbModels.js";

export const EmployeeAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const Decoded = jwt.decode(token);
    if (!Decoded?.id || Decoded?.role !== "employee") {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const Employee = await UserModel.findOne({
      where: {
        id: Decoded.id,
        role: "employee",
      },
    });

    if (!Employee) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    req.employeeId = Decoded.id;
    next();
  } catch (error) {
    console.error("Error in E-AUTH:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const AssetMasterAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const Decoded = jwt.decode(token);
    if (!Decoded?.id || Decoded?.role !== "master") {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const Master = await UserModel.findOne({
      where: {
        id: Decoded.id,
        role: "master",
      },
    });
    if (!Master) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    req.masterId = Decoded.id;
    next();
  } catch (error) {
    console.error("Error in A-AUTH:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const CategoryMasterAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const Decoded = jwt.decode(token);
    if (!Decoded?.id || Decoded?.role !== "category") {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    const categoryMaster = await UserModel.findOne({
      where: {
        id: Decoded.id,
        role: "category",
      },
    });
    if (!categoryMaster) {
      return res.status(200).json({ code: 401, msg: "Unauthorized" });
    }
    req.categoryId = Decoded.id;
    next();
  } catch (error) {
    console.error("Error in A-AUTH:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};
