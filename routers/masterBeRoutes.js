import express from "express";
import { SignUpController } from "../controller/loginController.js";
import {
  AddAsset,
  AvailableAssets,
  EditAssetWithId,
  GetAssetWithId,
  GetHistoryWithEmployeeId,
  GetScrapedAssets,
  GetStock,
  IssueAsset,
  IssuedAsset,
  ManageAsset,
} from "../controller/assetController.js";
import { AssetMasterAuth } from "../middlewares/Auth.js";
import { AllEmployees } from "../controller/masterController.js";

const masterBeRoutes = express.Router();

masterBeRoutes.post("/asset/add", AssetMasterAuth, AddAsset);
masterBeRoutes.get("/assets", AssetMasterAuth, AvailableAssets);
masterBeRoutes.get("/asset/:id", AssetMasterAuth, GetAssetWithId);
masterBeRoutes.put("/asset/:id", AssetMasterAuth, EditAssetWithId);
masterBeRoutes.get("/master/employees", AssetMasterAuth, AllEmployees);
masterBeRoutes.post("/issue_asset", AssetMasterAuth, IssueAsset);
masterBeRoutes.get("/manage/asset", AssetMasterAuth, IssuedAsset);
masterBeRoutes.post("/manage/asset", AssetMasterAuth, ManageAsset);
masterBeRoutes.get("/stock", AssetMasterAuth, GetStock);
masterBeRoutes.get("/history/:id", AssetMasterAuth, GetHistoryWithEmployeeId);
masterBeRoutes.get("/scrap-assets", AssetMasterAuth, GetScrapedAssets);
export default masterBeRoutes;
