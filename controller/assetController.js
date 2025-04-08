import { AssetModel, AssetHistoryModel } from "../db/assetModels.js";
import { EmployeeModel, UserModel } from "../db/dbModels.js";
import { sequelize } from "../db/dbServer.js";

export const AddAsset = async (req, res) => {
  let { make, model, description, serialNo } = req.body;

  if (
    typeof make !== "string" ||
    make.trim().length < 2 ||
    typeof model !== "string" ||
    model.trim().length < 1 ||
    typeof description !== "string" ||
    description.trim().length < 5 ||
    typeof serialNo !== "string" ||
    serialNo.trim().length < 5
  ) {
    return res.status(200).json({ msg: "Invalid Asset Data", code: 400 });
  }

  make = make.trim().toUpperCase();
  model = model.trim().toUpperCase();
  serialNo = serialNo.trim().toUpperCase();
  description = description.trim();

  const assetExists = await AssetModel.findOne({ where: { serialNo } });
  if (assetExists) {
    return res.status(200).json({ code: 400, msg: "Serial number exists" });
  }

  await AssetModel.create({
    make,
    model,
    description: description.trim(),
    serialNo,
  });

  return res.status(200).json({ code: 200, msg: "Asset added successfully" });
};

export const AllAssets = async (req, res) => {
  try {
    const allAssets = await AssetModel.findAll({
      where: { status: "returned" },
    });
    return res.status(200).json({ code: 200, value: allAssets });
  } catch (error) {
    console.error("E_ALL_ASSETS:", error.message);
    return res
      .status(200)
      .json({ code: 500, msg: "Server error", error: error.message });
  }
};

export const GetAssetWithId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }

    const asset = await AssetModel.findByPk(id);

    if (!asset) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }

    return res.status(200).json({ code: 200, value: asset });
  } catch (error) {
    console.error("E_GET_ASSET:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const EditAssetWithId = async (req, res) => {
  try {
    const { id } = req.params;
    let { make, model, description } = req.body;

    if (
      !id ||
      isNaN(id) ||
      !make?.trim() ||
      !model?.trim() ||
      !description?.trim()
    ) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }

    make = make.toUpperCase();
    model = model.toUpperCase();

    const [updatedCount] = await AssetModel.update(
      {
        make,
        model,
        description,
      },
      {
        where: { id },
      }
    );
    if (updatedCount === 0) {
      return res
        .status(200)
        .json({ code: 400, msg: "Asset not found or update failed" });
    }

    return res
      .status(200)
      .json({ code: 200, msg: "Asset updated successfully" });
  } catch (error) {
    console.error("Error in EDITASSET:", error.message);
    return res.status(200).json({ code: 500, msg: "Server Error" });
  }
};

export const IssueAsset = async (req, res) => {
  try {
    const { employeeId, assetId } = req.body;

    if (!employeeId || !assetId || isNaN(employeeId) || isNaN(assetId)) {
      return res.status(200).json({ code: 400, msg: "Invalid data" });
    }

    const employee = await EmployeeModel.findByPk(employeeId);
    if (!employee) {
      return res.status(200).json({ code: 404, msg: "Employee not found" });
    }

    const [updatedCount] = await AssetModel.update(
      {
        status: "assigned",
        currentUserId: employeeId,
      },
      {
        where: {
          id: assetId,
          status: "returned",
        },
      }
    );

    if (updatedCount === 0) {
      return res
        .status(200)
        .json({ code: 404, msg: "Asset not found or already assigned" });
    }
    await AssetHistoryModel.create({
      assetId: assetId,
      employeeId: employeeId,
      masterId: req.masterId,
      action: "assigned",
      time: new Date(),
    });

    return res
      .status(200)
      .json({ code: 200, msg: "Asset issued successfully" });
  } catch (error) {
    console.error("Error in ISSUE_ASSET:", error.message);
    return res.status(200).json({ code: 500, msg: "Server Error" });
  }
};

export const IssuedAsset = async (req, res) => {
  try {
    const issuedAssets = await AssetModel.findAll({
      where: { status: "assigned" },
      attributes: {
        exclude: ["description", "status"],
      },
      include: [
        {
          model: EmployeeModel,
          as: "currentUser",
          attributes: ["email"],
        },
      ],
    });
    return res.status(200).json({ code: 200, value: issuedAssets });
  } catch (error) {
    console.error("Error in ISSUED_ASSET:", error.message);
    return res.status(200).json({ code: 500, msg: "Server Error" });
  }
};

export const ManageAsset = async (req, res) => {
  try {
    const { serialNo, action, reason } = req.body;

    if (!serialNo || !action || !["scrap", "return"].includes(action)) {
      return res
        .status(200)
        .json({ code: 400, msg: "Missing required fields" });
    }

    const asset = await AssetModel.findOne({ where: { serialNo } });
    if (!asset) {
      return res.status(200).json({ code: 404, msg: "Asset not found" });
    }

    if (action === "scrap") {
      const employeeId = asset.currentUserId;

      await AssetModel.update(
        { status: "scrapped", currentUserId: null },
        { where: { id: asset.id } }
      );

      await AssetHistoryModel.create({
        assetId: asset.id,
        employeeId,
        masterId: req.masterId,
        action: "scrapped",
        time: new Date(),
      });

      return res
        .status(200)
        .json({ code: 200, msg: "Asset scrapped successfully" });
    } else {
      if (!reason || !reason.trim()) {
        return res
          .status(200)
          .json({ code: 400, msg: "Return reason is required" });
      }

      const employeeId = asset.currentUserId;

      await AssetModel.update(
        { status: "returned", currentUserId: null },
        { where: { id: asset.id } }
      );

      await AssetHistoryModel.create({
        assetId: asset.id,
        employeeId,
        masterId: req.masterId,
        action: "returned",
        reason: reason.trim(),
        time: new Date(),
      });

      return res
        .status(200)
        .json({ code: 200, msg: "Asset returned successfully" });
    }
  } catch (error) {
    console.error("Error in MANAGE_ASSET:", error.message);
    return res.status(200).json({ code: 500, msg: "Server error" });
  }
};

export const GetHistoryWithEmployeeId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(200).json({ code: 400, msg: "Invalid employee ID" });
    }

    const history = await AssetHistoryModel.findAll({
      where: { employeeId: id },
      attributes: {
        exclude: ["id", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: AssetModel,
          as: "asset",
          attributes: ["serialNo", "make", "category"],
        },
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["email"],
        },
        {
          model: UserModel,
          as: "master",
          attributes: ["email"],
        },
      ],
    });

    return res.status(200).json({
      code: 200,
      value: history,
    });
  } catch (error) {
    console.error("Error in ASSET_HISTORY:", error.message);
    return res.status(200).json({
      code: 500,
      msg: "Server Error",
    });
  }
};

export const GetScrapedAssets = async (req, res) => {
  try {
    const scrappedAssets = await AssetModel.findAll({
      where: { status: "scrapped" },
      attributes: {
        exclude: [
          "id",
          "currentUserId",
          "description",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    return res.status(200).json({
      code: 200,
      value: scrappedAssets,
    });
  } catch (error) {
    console.error("Error in SCRAPPED_ASSET:", error.message);
    return res.status(200).json({
      code: 500,
      msg: "Server Error",
    });
  }
};

export const GetStock = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        category,
        SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS assigned,
        SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) AS returned,
        SUM(CASE WHEN status = 'scrapped' THEN 1 ELSE 0 END) AS scrapped
      FROM "Assets"
      GROUP BY category
      ORDER BY category ASC;
    `);

    return res.status(200).json({
      code: 200,
      value: results,
    });
  } catch (error) {
    console.error("Error in GET_STOCK:", error.message);
    return res.status(200).json({
      code: 500,
      msg: "Server Error",
    });
  }
};
