import MatchRequest from "../models/matchRequests.js";
import Match from "../models/match.js";

// Lấy tất cả yêu cầu tham gia
export const getAllMatchRequests = async (req, res) => {
    try {
        const requests = await MatchRequest.find().populate("user match");
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy yêu cầu theo ID
export const getMatchRequestById = async (req, res) => {
    try {
        const request = await MatchRequest.findById(req.params.id).populate("user match");
        if (!request) {
            return res.status(404).json({ message: "Yêu cầu không tồn tại" });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy yêu cầu theo match ID
export const getMatchRequestsByMatchId = async (req, res) => {
    try {
        const requests = await MatchRequest.findOne({ match: req.params.matchId, status: 'pending' }).populate("user match club_B targetUser");
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getMatchRequestsByMatchId:", error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy yêu cầu theo user ID
export const getMatchRequestsByUserId = async (req, res) => {
    try {
        const requests = await MatchRequest.find({ user: req.params.userId }).populate("user match");
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo yêu cầu tham gia mới
export const createMatchRequest = async (req, res) => {
    try {
        // Kiểm tra xem trận đấu có tồn tại không
        const match1 = await Match.findById(req.body.match);
        if (!match1) {
            return res.status(404).json({ message: "Trận đấu không tồn tại" });
        }

        // Kiểm tra xem đã có yêu cầu từ user này cho trận đấu này chưa
        const existingRequest = await MatchRequest.findOne({
            match: req.body.match,
            user: req.body.user,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Bạn đã gửi yêu cầu cho trận đấu này rồi" });
        }

        // Tạo yêu cầu mới
        const newRequest = new MatchRequest(req.body);
        const savedRequest = await newRequest.save();

        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật trạng thái yêu cầu
export const updateMatchRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedField = await MatchRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json(updatedField);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật yêu cầu
export const updateMatchRequest = async (req, res) => {
    try {
        const updatedRequest = await MatchRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("user match");

        if (!updatedRequest) {
            return res.status(404).json({ message: "Yêu cầu không tồn tại" });
        }

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa yêu cầu
export const deleteMatchRequest = async (req, res) => {
    try {
        const deletedRequest = await MatchRequest.findByIdAndDelete(req.params.id);
        if (!deletedRequest) {
            return res.status(404).json({ message: "Yêu cầu không tồn tại" });
        }
        res.status(200).json({ message: "Yêu cầu đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
