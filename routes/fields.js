import express from "express";
import {
  getAllFields,
  getFieldById,
  getFieldsByFootballFieldId,
  createField,
  updateField,
  deleteField
} from "../controllers/fields.js";

const fieldRoutes = express.Router();

fieldRoutes.get("/", getAllFields);
fieldRoutes.get("/:id", getFieldById);
fieldRoutes.get("/footballId/:id", getFieldsByFootballFieldId);
fieldRoutes.post("/", createField);
fieldRoutes.patch("/:id", updateField);
fieldRoutes.delete("/:id", deleteField);

export default fieldRoutes;
