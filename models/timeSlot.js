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
    footballField: {
        type: ObjectId,
        ref: "FootballField"
    },
    
}, { timestamps: true });

// ✅ Thêm indexes TRƯỚC khi tạo model
timeSlotSchema.index({ footballField: 1, datetime: 1 });
timeSlotSchema.index({ fieldId: 1, isBooked: 1 });
timeSlotSchema.index({ footballField: 1, isBooked: 1 });
timeSlotSchema.index({ datetime: 1 });

export default mongoose.model("TimeSlot", timeSlotSchema);
