import "dotenv/config";
import express from "express";
import path from "path";
import "./db/dbServer.js";
import CommonRouter from "./routers/commonFeRoutes.js";
import EmployeeFeRouter from "./routers/employeeFeRoutes.js";
import masterFeRoutes from "./routers/masterFeRoutes.js";
import masterBeRoutes from "./routers/masterBeRoutes.js";
import EmployeeBeRouter from "./routers/employeeBeRoutes.js";
import categoryBeRoutes from "./routers/categoryBeRoutes.js";
import categoryFeRoutes from "./routers/categoryFeRoutes.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use("/", CommonRouter);
app.use("/", EmployeeFeRouter);
app.use("/", categoryFeRoutes);
app.use("/master", masterFeRoutes);
app.use("/api", EmployeeBeRouter);
app.use("/api", masterBeRoutes);
app.use("/api", categoryBeRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
