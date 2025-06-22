import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const commentSchema = new Schema(
    {
        matchId: {
            type: ObjectId,
            ref: "Match",
            required: true,
        },
        userId: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// ✅ Thêm indexes cho performance
commentSchema.index({ matchId: 1, isDeleted: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 });

export default mongoose.model("Comment", commentSchema);
