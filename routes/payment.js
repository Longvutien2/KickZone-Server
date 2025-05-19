import express from "express";
import Match from "../models/match";

const paymentSepay = express.Router();

// 1. Lấy tất cả trận đấu
paymentSepay.post("/", async (req, res) => {
    try {
        const matches = await Match.find().populate("club_A club_B user footballField bookingId");
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default paymentSepay;
