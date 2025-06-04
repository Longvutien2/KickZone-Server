import FootballField from "../models/footballField.js";

// Lấy danh sách tất cả sân bóng
export const getAllFootballFields = async (req, res) => {
  try {
    const fields = await FootballField.find().populate("userId");
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy football field theo user ID
export const getFootballFieldByUserId = async (req, res) => {
  try {
    const field = await FootballField.findOne({ userId: req.params.id });
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy football fields theo status
export const getFootballFieldsByStatus = async (req, res) => {
  try {
    const fields = await FootballField.find({ status: req.params.status }).populate("userId");
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy football field theo ID
export const getFootballFieldById = async (req, res) => {
  try {
    const field = await FootballField.findOne({ _id: req.params.id });
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách địa chỉ unique
export const getUniqueAddresses = async (req, res) => {
  try {
    const fields = await FootballField.find();
    const uniqueAddresses = [...new Set(fields.map((item) => item.address.province))];
    res.json(uniqueAddresses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server", error });
  }
};

// Tạo mới một sân bóng
export const createFootballField = async (req, res) => {
  try {
    const newField = new FootballField(req.body);
    const savedField = await newField.save();
    res.status(201).json(savedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật football field
export const updateFootballField = async (req, res) => {
  try {
    const updatedField = await FootballField.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
