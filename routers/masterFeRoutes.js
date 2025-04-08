import express from "express";
const masterFeRoutes = express.Router();

masterFeRoutes.get("/", (req, res) => {
  res.render("masterDash");
});

masterFeRoutes.get("/asset/add", (req, res) => {
  res.render("masterAddAsset");
});

masterFeRoutes.get("/asset/edit/:id", (req, res) => {
  res.render("masterEditAsset");
});

masterFeRoutes.get("/asset/issue/:asset_id", (req, res) => {
  res.render("issueAsset");
});

masterFeRoutes.get("/asset/manage", (req, res) => {
  res.render("AssetManage");
});

masterFeRoutes.get("/stock", (req, res) => {
  res.render("stockView");
});

masterFeRoutes.get("/employees", (req, res) => {
  res.render("assetHistory");
});

masterFeRoutes.get("/scrap-asset", (req, res) => {
  res.render("scrapAsset");
});

export default masterFeRoutes;
