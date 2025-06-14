import express from "express";
import {
    getCommentsByMatchId,
    createComment,
    updateComment,
    deleteComment,
    createReply,
    updateReply,
    deleteReply
} from "../controllers/comment.js";

const commentRouter = express.Router();

// Routes cho comments
commentRouter.get("/match/:matchId", getCommentsByMatchId);
commentRouter.post("/match/:matchId", createComment);
commentRouter.put("/:commentId", updateComment);
commentRouter.delete("/:commentId", deleteComment);

// Routes cho replies
commentRouter.post("/:commentId/replies", createReply);
commentRouter.put("/replies/:replyId", updateReply);
commentRouter.delete("/replies/:replyId", deleteReply);

export default commentRouter;
