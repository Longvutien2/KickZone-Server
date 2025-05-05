import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// Define the schema for the football team
const teamSchema = new mongoose.Schema({
    teamImage: {
        type: String,
    },
    teamImageBg: {
        type: String,
    },
    teamName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    ageGroup: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    members: [{
        user: {
            type: ObjectId,
            ref: "User"
        },
        position: {
            type: String
        },
        age: {
            type: Number
        },
        jerseyNumber: {
            type: Number
        },
        joinDate: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Export the model
export default mongoose.model("Team", teamSchema);
