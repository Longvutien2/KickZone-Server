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
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        contactClubB: {
            type: String,
        },
        duration: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },

    },
    { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
