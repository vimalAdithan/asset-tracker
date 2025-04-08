import express from "express";
import {
  SignInController,
  SignUpController,
} from "../controller/loginController.js";
import { EmployeeAuth } from "../middlewares/Auth.js";
import {
  AddEmployee,
  EditEmployeeWithId,
  GetEmployeeWithId,
  MyEmployees,
} from "../controller/employeeController.js";
const EmployeeBeRouter = express.Router();

EmployeeBeRouter.post("/signup", SignUpController);
EmployeeBeRouter.post("/login", SignInController);
EmployeeBeRouter.get("/employees", EmployeeAuth, MyEmployees);
EmployeeBeRouter.get("/employee/:id", EmployeeAuth, GetEmployeeWithId);
EmployeeBeRouter.post("/employee/add", EmployeeAuth, AddEmployee);
EmployeeBeRouter.put("/employee/:id", EmployeeAuth, EditEmployeeWithId);

export default EmployeeBeRouter;
