import "dotenv/config";
import express from "express";
import path from "path";
import "./db/dbServer.js";
import CommonRouter from "./routers/commonFeRoutes.js";
import EmployeeFeRouter from "./routers/employeeFeRoutes.js";
import masterFeRoutes from "./routers/masterFeRoutes.js";
import masterBeRoutes from "./routers/masterBeRoutes.js";
import EmployeeBeRouter from "./routers/employeeBeRoutes.js";
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
app.use("/master", masterFeRoutes);
app.use("/api", EmployeeBeRouter);
app.use("/api", masterBeRoutes);

app.listen(4000, () => {
  console.log("Server running in port 4000");
});
