const express = require("express");
import TimeSlot from "../models/timeSlot";

const timeSlotRouter = express.Router();

// Tạo khung giờ mới
timeSlotRouter.post("/", async (req, res) => {
    try {
        const newSlot = await TimeSlot.create(req.body);
        res.status(200).json(newSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tạo sửa khung giờ
timeSlotRouter.patch("/:id", async (req, res) => {
  try {
    const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTimeSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// list timeslot for field
timeSlotRouter.get("/", async (req, res) => {
    try {
        const slots = await TimeSlot.find();
        res.status(200).json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

timeSlotRouter.delete("/:id", async (req, res) => {
    try {
        const slots = await  TimeSlot.findOneAndDelete({_id: req.params.id}).exec()
        res.json(slots)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

timeSlotRouter.delete("/byField/:fieldId", async (req, res) => {
    try {
        const slots = await  TimeSlot.deleteMany({fieldId: req.params.fieldId}).exec()
        res.json(slots)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default timeSlotRouter;
