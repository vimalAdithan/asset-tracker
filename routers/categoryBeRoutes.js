import express from "express";
import { CategoryMasterAuth } from "../middlewares/Auth.js";
import {
  addCategory,
  AllAssets,
  GetCategoryList,
  updateAssetCategory,
} from "../controller/categoryController.js";
const categoryBeRoutes = express.Router();

categoryBeRoutes.get("/category-list", GetCategoryList);
categoryBeRoutes.get("/category-assets", CategoryMasterAuth, AllAssets);
categoryBeRoutes.post("/add-category", CategoryMasterAuth, addCategory);
categoryBeRoutes.post(
  "/update-category",
  CategoryMasterAuth,
  updateAssetCategory
);

export default categoryBeRoutes;
