import mongoose, { Schema } from "mongoose";
import { ObjectId } from "mongodb";

const matchSchema = new Schema(
    {
        club_A: {
            type: ObjectId,
            ref: "Team",
            required: true,
        },
        club_B: {
            type: ObjectId,
            ref: "Team",
        },
        user: {
            type: ObjectId,
            ref: "User",
            required: true,
        },
        footballField: {
            type: ObjectId,
            ref: "FootballField",
            required: true,
        },
        orderId: {
            type: ObjectId,
            ref: "PaymentOrder",
        },
        date: {
            type: Date,
        },
        time: {
            type: String,
        },
        contact: {
            type: String,
        },
        contactClubB: {
            type: String,
        },
        duration: {
            type: String,
        },
        description: {
            type: String,
        },

    },
    { timestamps: true }
);

// ✅ Thêm indexes quan trọng cho performance
matchSchema.index({ user: 1, date: -1 });
matchSchema.index({ footballField: 1, date: 1 });
matchSchema.index({ club_A: 1 });
matchSchema.index({ club_B: 1 });
matchSchema.index({ date: 1, time: 1 });
matchSchema.index({ createdAt: -1 });

export default mongoose.model("Match", matchSchema);
