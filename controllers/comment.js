import Comment from "../models/comment.js";
import CommentReply from "../models/commentReply.js";

// Lấy tất cả comments của một match với replies
export const getCommentsByMatchId = async (req, res) => {
    try {
        const { matchId } = req.params;
        
        // Lấy comments chính
        const comments = await Comment.find({ 
            matchId: matchId, 
            isDeleted: false 
        })
        .populate("userId", "name email image")
        .sort({ createdAt: -1 })
        .lean();

        // Lấy replies cho từng comment
        for (let comment of comments) {
            const replies = await CommentReply.find({ 
                commentId: comment._id, 
                isDeleted: false 
            })
            .populate("userId", "name email image")
            .sort({ createdAt: 1 })
            .lean();
            
            comment.replies = replies;
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo comment mới
export const createComment = async (req, res) => {
    try {
        const { matchId } = req.params;
        const { content, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }

        if (!userId) {
            return res.status(400).json({ message: "Thiếu thông tin người dùng" });
        }

        const newComment = new Comment({
            matchId,
            userId,
            content: content.trim()
        });

        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate("userId", "name email image avatar")
            .lean();

        populatedComment.replies = [];

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật comment
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }

        // Kiểm tra quyền sở hữu comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa bình luận này" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: content.trim() },
            { new: true }
        ).populate("userId", "name email image avatar");

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa comment (soft delete)
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;

        // Kiểm tra quyền sở hữu comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
        }

        // Soft delete comment và tất cả replies
        await Comment.findByIdAndUpdate(commentId, { isDeleted: true });
        await CommentReply.updateMany({ commentId }, { isDeleted: true });

        res.status(200).json({ message: "Đã xóa bình luận thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo reply cho comment
export const createReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung trả lời không được để trống" });
        }

        if (!userId) {
            return res.status(400).json({ message: "Thiếu thông tin người dùng" });
        }

        // Kiểm tra comment có tồn tại không
        const comment = await Comment.findById(commentId);
        if (!comment || comment.isDeleted) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        const newReply = new CommentReply({
            commentId,
            userId,
            content: content.trim()
        });

        const savedReply = await newReply.save();
        const populatedReply = await CommentReply.findById(savedReply._id)
            .populate("userId", "name email image avatar");

        res.status(201).json(populatedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật reply
export const updateReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { content, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Nội dung trả lời không được để trống" });
        }

        // Kiểm tra quyền sở hữu reply
        const reply = await CommentReply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ message: "Không tìm thấy trả lời" });
        }

        if (reply.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa trả lời này" });
        }

        const updatedReply = await CommentReply.findByIdAndUpdate(
            replyId,
            { content: content.trim() },
            { new: true }
        ).populate("userId", "name email image avatar");

        res.status(200).json(updatedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa reply (soft delete)
export const deleteReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { userId } = req.body;

        // Kiểm tra quyền sở hữu reply
        const reply = await CommentReply.findById(replyId);
        if (!reply) {
            return res.status(404).json({ message: "Không tìm thấy trả lời" });
        }

        if (reply.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa trả lời này" });
        }

        await CommentReply.findByIdAndUpdate(replyId, { isDeleted: true });

        res.status(200).json({ message: "Đã xóa trả lời thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
