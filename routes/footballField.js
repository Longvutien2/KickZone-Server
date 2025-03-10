import express from "express";
import FootballField from "../models/footballField";

const footballField = express.Router();

// 1️ Lấy danh sách tất cả sân bóng
footballField.get("/", async (req, res) => {
  try {
    const fields = await FootballField.find();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get field by id user
footballField.get("/:id/user", async (req, res) => {
  try {
    const fields = await FootballField.findOne({ userId: req.params.id });
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

footballField.get("/:id", async (req, res) => {
  try {
    const fields = await FootballField.findOne({ _id: req.params.id });
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2️ Tạo mới một sân bóng
footballField.post("/", async (req, res) => {
  try {
    const newField = new FootballField(req.body);
    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // 3️ Cập nhật lịch đặt sân
// fieldRoutes.patch("/:id", async (req, res) => {
//   try {
//     const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedField);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // 4️ Xóa một sân bóng
// fieldRoutes.delete("/:id", async (req, res) => {
//   try {
//     const slots = await Field.findOneAndDelete({ _id: req.params.id });
//     res.status(200).json(slots);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

export default footballField;
