import mongoose from "mongoose";
import { ObjectId } from "mongodb";


const footballFieldSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        desc: { type: String },
        userId: {
            type: ObjectId,
            ref: "User"
        },
        // timeSlot: {
        //     type: ObjectId,
        //     ref: "TimeSlot"
        // }
    },
    { timestamps: true }
);

export default mongoose.model("FootballField", footballFieldSchema);
