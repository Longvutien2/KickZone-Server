import mongoose from "mongoose";
import { ObjectId } from "mongodb";


const footballFieldSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        address: {
            province: { type: String, required: true },
            district: { type: String, required: true },
            ward: { type: String, required: true },
            detail: { type: String }
        },
        phone: { type: String, required: true },
        description: { type: String },
        userId: {
            type: ObjectId,
            ref: "User"
        },
        status: { type: String, enum: ["Hoạt động", "Bảo trì", "Vô hiệu hóa", "Chờ xác nhận"], default: "Chờ xác nhận" },
        // timeSlot: {
        //     type: ObjectId,
        //     ref: "TimeSlot"
        // }
    },
    { timestamps: true }
);

export default mongoose.model("FootballField", footballFieldSchema);
