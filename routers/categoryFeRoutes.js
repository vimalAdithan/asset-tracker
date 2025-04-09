import express from "express";
const categoryFeRoutes = express.Router();

categoryFeRoutes.get("/category", (req, res) => {
  res.render("categoryDash");
});

export default categoryFeRoutes;
