import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const timeSlotSchema = new mongoose.Schema({
    time: { type: String, required: true },
    price: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    datetime: { type: String },
    fieldId: {
        type: ObjectId,
        ref: "Field"
    },
}, { timestamps: true });


export default mongoose.model("TimeSlot", timeSlotSchema);
