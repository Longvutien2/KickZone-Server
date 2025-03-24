import express from "express";
import Field from "../models/field";
import mongoose from "mongoose";

const fieldRoutes = express.Router();

// 1️ Lấy danh sách tất cả sân bóng
fieldRoutes.get("/", async (req, res) => {
  try {
    const fields = await Field.find();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

fieldRoutes.get("/:id", async (req, res) => {
  try {
    const fields = await Field.findOne({ _id: req.params.id }).populate("foolballFieldId");
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


fieldRoutes.get("/footballId/:id", async (req, res) => {
  try {

    const footballFieldId = new mongoose.Types.ObjectId(req.params.id);  // Lấy ID từ request

    // Sử dụng aggregation để kết hợp cả Field và TimeSlot trong một truy vấn
    const populatedFields = await Field.aggregate([
      {
        $match: { foolballFieldId: footballFieldId }  // Lọc các Field có footballFieldId trùng với ID
      },
      {
        $lookup: {
          from: "timeslots",  // Thực hiện join với collection TimeSlot
          localField: "_id",   // Dùng _id của Field
          foreignField: "fieldId",  // Dùng fieldId trong TimeSlot để join
          as: "timeSlots"   // Gán kết quả vào trường "timeSlots"
        }
      }
    ]);
    res.status(200).json(populatedFields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 2️ Tạo mới một sân bóng
fieldRoutes.post("/", async (req, res) => {
  try {
    const newField = new Field(req.body);
    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3️ Cập nhật lịch đặt sân
fieldRoutes.patch("/:id", async (req, res) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4️ Xóa một sân bóng
fieldRoutes.delete("/:id", async (req, res) => {
  try {
    const slots = await Field.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default fieldRoutes;
