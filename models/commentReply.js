import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const commentReplySchema = new Schema(
    {
        commentId: {
            type: ObjectId,
            ref: "Comment",
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

export default mongoose.model("CommentReply", commentReplySchema);
