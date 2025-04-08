import { EmployeeModel } from "../db/dbModels.js";
import { emailRegex, nameRegex, phoneRegex } from "../utils/Regex.js";

export const AddEmployee = async (req, res) => {
  const { name, email, phone } = req.body;
  if (
    !nameRegex.test(name) ||
    !emailRegex.test(email) ||
    !phoneRegex.test(phone)
  ) {
    return res.status(200).json({ msg: "Invalid Data", code: 400 });
  }
  const EmployeeExist = await EmployeeModel.findOne({ where: { email } });
  if (EmployeeExist) {
    return res.status(200).json({ code: 400, msg: "Employee already exist" });
  }
  await EmployeeModel.create({
    name,
    email,
    phone,
    status: "active",
    addedBy: req.employeeId,
  });
  return res
    .status(200)
    .json({ code: 200, msg: "Employee created successfully" });
};

export const MyEmployees = async (req, res) => {
  const AllEmployees = await EmployeeModel.findAll({
    where: { addedBy: req.employeeId },
    attributes: { exclude: ["addedBy", "phone", "createdAt", "updatedAt"] },
  });
  return res.status(200).json({ code: 200, value: AllEmployees });
};

export const GetEmployeeWithId = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }
    const employee = await EmployeeModel.findOne({
      where: { id },
      attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    });
    if (!employee) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }
    return res.status(200).json({ code: 200, value: employee });
  } catch (err) {
    console.error("E_GET_EMPLOYEE:", err.message);
    return res.status(500).json({ code: 500, msg: "Server Error" });
  }
};

export const EditEmployeeWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, status } = req.body;
    if (
      !nameRegex.test(name) ||
      !phoneRegex.test(phone) ||
      !["active", "inactive"].includes(status) ||
      isNaN(id)
    ) {
      return res.status(200).json({ msg: "Invalid Data", code: 400 });
    }

    const updateResult = await EmployeeModel.update(
      { name, phone, status },
      {
        where: {
          id,
          addedBy: req.employeeId,
        },
      }
    );
    const [affectedRows] = updateResult;
    if (affectedRows === 0) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }
    return res
      .status(200)
      .json({ code: 200, msg: "Employee updated successfully" });
  } catch (err) {
    console.error("E_EDIT_EMPLOYEE:", err.message);
    return res.status(500).json({ code: 500, msg: "Server Error" });
  }
};
