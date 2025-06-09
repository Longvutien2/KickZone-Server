import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const MatchRequest = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    match: {
        type: ObjectId,
        ref: "Match",
        required: true,
    },
    club_B: {
        type: ObjectId,
        ref: "Team",
        required: true,
    },
    targetUser: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

// Export the model
export default mongoose.model("MatchRequest", MatchRequest);
