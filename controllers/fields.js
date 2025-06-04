import Field from "../models/field.js";

// Lấy danh sách tất cả sân bóng
export const getAllFields = async (req, res) => {
  try {
    const fields = await Field.find();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy field theo ID
export const getFieldById = async (req, res) => {
  try {
    const field = await Field.findOne({ _id: req.params.id }).populate("foolballFieldId");
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy fields theo football field ID
export const getFieldsByFootballFieldId = async (req, res) => {
  try {
    const fields = await Field.find({ foolballFieldId: req.params.id }).populate("foolballFieldId");
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới một sân bóng
export const createField = async (req, res) => {
  try {
    const newField = new Field(req.body);
    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật field
export const updateField = async (req, res) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa một sân bóng
export const deleteField = async (req, res) => {
  try {
    const deletedField = await Field.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(deletedField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
