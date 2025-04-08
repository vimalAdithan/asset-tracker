import express from "express";
const EmployeeFeRouter = express.Router();

EmployeeFeRouter.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

EmployeeFeRouter.get("/employee/add", (req, res) => {
  res.render("employeeAdd");
});

EmployeeFeRouter.get("/employee/edit/:id", (req, res) => {
  res.render("employeeEdit");
});

export default EmployeeFeRouter;
