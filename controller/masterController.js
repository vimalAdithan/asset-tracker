import { EmployeeModel } from "../db/dbModels.js";

export const AllEmployees = async (req, res) => {
  const AllEmployees = await EmployeeModel.findAll();
  return res.status(200).json({ code: 200, value: AllEmployees });
};
