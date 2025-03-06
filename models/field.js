import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// const timeSlotSchema = new mongoose.Schema({
//   time: { type: String, required: true },
//   price: { type: String, required: true },
//   isBooked: { type: Boolean, default: false },
// });

// const scheduleSchema = new mongoose.Schema({
//   date: { type: String, required: true },
//   timeSlots: [timeSlotSchema],
// });

const sanBongSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    people: { type: Number, required: true }, // Số người tối đa
    start_time: { type: String, required: true }, // Giờ mở cửa
    end_time: { type: String, required: true }, // Giờ đóng cửa
    status: { type: String, enum: ["Hoạt động", "Bảo trì"], default: "Hoạt động" }, // Tình trạng sân
  },
  { timestamps: true }
);

export default mongoose.model("Field", sanBongSchema);
