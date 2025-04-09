import { AssetModel } from "../db/assetModels.js";
import { CategoryModel } from "../db/dbModels.js";

export const AllAssets = async (req, res) => {
  try {
    const allAssets = await AssetModel.findAll();
    return res.status(200).json({ code: 200, value: allAssets });
  } catch (error) {
    console.error("E_ALL_ASSETS:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const GetCategoryList = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll({ attributes: ["name"] });
    const names = categories.map((cat) => cat.name);
    res.status(200).json({ code: 200, value: names });
  } catch (error) {
    console.error("E_GET_CAT_LIST :", error.message);
    res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name)
      return res.status(200).json({ code: 400, msg: "Name is required" });
    name = name.trim().toUpperCase();
    const [category, created] = await CategoryModel.findOrCreate({
      where: { name },
    });
    if (!created)
      return res
        .status(200)
        .json({ code: 409, msg: "Category already exists" });
    res.status(200).json({ code: 200, msg: "Category added", value: category });
  } catch (error) {
    console.error(error.message);
    res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const updateAssetCategory = async (req, res) => {
  try {
    let { assetId, newCategory } = req.body;

    if (!assetId || !newCategory) {
      return res.status(200).json({ code: 400, msg: "Invalid data provided" });
    }
    newCategory = newCategory.trim().toUpperCase();
    const categoryExists = await CategoryModel.findOne({
      where: { name: newCategory },
    });
    if (!categoryExists) {
      return res.status(200).json({ code: 404, msg: "Category not found" });
    }

    const asset = await AssetModel.findByPk(assetId);
    if (!asset) {
      return res.status(200).json({ code: 404, msg: "Asset not found" });
    }
    asset.category = newCategory;
    await asset.save();
    return res.json({ code: 200, msg: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating asset category:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};
