import TimeSlot from "../models/timeSlot.js";

// Helper function để convert time string thành số để sort
const timeToMinutes = (timeString) => {
    const [start] = timeString.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);
    return hours * 60 + minutes;
};

// Tạo khung giờ mới
export const createTimeSlot = async (req, res) => {
    try {
        const newSlot = await TimeSlot.create(req.body);
        res.status(200).json(newSlot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật khung giờ
export const updateTimeSlot = async (req, res) => {
    try {
        const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedTimeSlot);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy time slots theo football field ID
export const getTimeSlotsByFootballFieldId = async (req, res) => {
    try {
        const data = await TimeSlot.find({ footballField: req.params.id }).populate("footballField");

        // Sort theo time từ sớm đến muộn
        const sortedData = data.sort((a, b) => {
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        });

        res.status(200).json(sortedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả time slots
export const getAllTimeSlots = async (req, res) => {
    try {
        const slots = await TimeSlot.find().populate("fieldId");

        // Sort theo time từ sớm đến muộn
        const sortedSlots = slots.sort((a, b) => {
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        });

        res.status(200).json(sortedSlots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy time slot theo ID
export const getTimeSlotById = async (req, res) => {
    try {
        const slot = await TimeSlot.findOne({ _id: req.params.id }).populate("fieldId");
        res.status(200).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa time slot theo ID
export const deleteTimeSlot = async (req, res) => {
    try {
        const slot = await TimeSlot.findOneAndDelete({ _id: req.params.id }).exec();
        res.json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa tất cả time slots theo field ID
export const deleteTimeSlotsByFieldId = async (req, res) => {
    try {
        const slots = await TimeSlot.deleteMany({ fieldId: req.params.fieldId }).exec();
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
