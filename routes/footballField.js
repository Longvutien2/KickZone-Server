import express from "express";
import {
  getAllFootballFields,
  getFootballFieldByUserId,
  getFootballFieldsByStatus,
  getFootballFieldById,
  getUniqueAddresses,
  createFootballField,
  updateFootballField
} from "../controllers/footballField.js";

const footballField = express.Router();

footballField.get("/", getAllFootballFields);
footballField.get("/address/field", getUniqueAddresses);
footballField.get("/:id/user", getFootballFieldByUserId);
footballField.get("/:status/status", getFootballFieldsByStatus);
footballField.get("/:id", getFootballFieldById);
footballField.post("/", createFootballField);
footballField.patch("/:id", updateFootballField);

export default footballField;
