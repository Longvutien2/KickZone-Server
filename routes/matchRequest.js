import express from "express";
import {
    getAllMatchRequests,
    getMatchRequestById,
    getMatchRequestsByMatchId,
    getMatchRequestsByUserId,
    createMatchRequest,
    updateMatchRequestStatus,
    updateMatchRequest,
    deleteMatchRequest
} from "../controllers/matchRequest.js";

const matchRequestRouter = express.Router();

// Lấy tất cả yêu cầu
matchRequestRouter.get("/", getAllMatchRequests);

// Lấy yêu cầu theo match ID
matchRequestRouter.get("/match/:matchId", getMatchRequestsByMatchId);

// Lấy yêu cầu theo user ID
matchRequestRouter.get("/user/:userId", getMatchRequestsByUserId);

// Lấy yêu cầu theo ID
matchRequestRouter.get("/:id", getMatchRequestById);

// Tạo yêu cầu mới
matchRequestRouter.post("/", createMatchRequest);

// Cập nhật trạng thái yêu cầu (chấp nhận/từ chối)
matchRequestRouter.patch("/:id/status", updateMatchRequestStatus);

// Cập nhật yêu cầu
matchRequestRouter.patch("/:id", updateMatchRequest);

// Xóa yêu cầu
matchRequestRouter.delete("/:id", deleteMatchRequest);

export default matchRequestRouter;
