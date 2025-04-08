import express from "express";
const CommonRouter = express.Router();

CommonRouter.get("/", (req, res) => {
  res.render("landing");
});

CommonRouter.get("/login", (req, res) => {
  res.render("login");
});

CommonRouter.get("/signup", (req, res) => {
  res.render("signup");
});

export default CommonRouter;
