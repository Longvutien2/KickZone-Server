import Match from "../models/match.js";

// Lấy tất cả trận đấu
export const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find().populate("club_A club_B user footballField orderId");
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy trận đấu theo ID
export const getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate("club_A club_B user footballField orderId");
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy trận đấu theo football field ID
export const getMatchesByFootballFieldId = async (req, res) => {
    try {
        const matches = await Match.find({ footballField: req.params.id }).populate("club_A club_B user footballField orderId");
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy trận đấu theo user ID
export const getMatchByUserId = async (req, res) => {
    try {
        const match = await Match.findOne({ user: req.params.userId });
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo mới trận đấu
export const createMatch = async (req, res) => {
    try {
        const newMatch = new Match(req.body);
        const savedMatch = await newMatch.save();
        const populatedMatch = await Match.findById(savedMatch._id).populate("club_A club_B user footballField orderId");
        res.status(201).json(populatedMatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật trận đấu
export const updateMatch = async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("club_A club_B user footballField orderId");
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa trận đấu
export const deleteMatch = async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
