import express from "express";
import Match from "../models/match";

const matchRouter = express.Router();

// 1. Lấy tất cả trận đấu
matchRouter.get("/", async (req, res) => {
    try {
        const matches = await Match.find().populate("club_A club_B user footballField bookingId");
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Lấy trận đấu theo ID
matchRouter.get("/:id", async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate("club_A club_B user footballField bookingId");
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

matchRouter.get("/footballField/:id", async (req, res) => {
    try {
        const match = await Match.find({ footballField: req.params.id }).populate("club_A club_B user footballField bookingId");
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 3. Lấy trận đấu theo userId
matchRouter.get("/byUser/:userId", async (req, res) => {
    try {
        const match = await Match.findOne({ user: req.params.userId });
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Tạo mới trận đấu
matchRouter.post("/", async (req, res) => {
    try {
        const newMatch = new Match(req.body);

        const savedMatch = await newMatch.save();
        res.status(201).json(savedMatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. Cập nhật trận đấu
matchRouter.patch("/:id", async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedMatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. Xóa trận đấu
matchRouter.delete("/:id", async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Match deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default matchRouter;
