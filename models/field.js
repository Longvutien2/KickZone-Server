import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const sanBongSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    people: { type: Number, required: true }, // Số người tối đa
    start_time: { type: String, required: true }, // Giờ mở cửa
    end_time: { type: String, required: true }, // Giờ đóng cửa,
    foolballFieldId: {
      type: ObjectId,
      ref: "FootballField"
    },
    status: { type: String, enum: ["Hoạt động", "Bảo trì"], default: "Hoạt động" }, // Tình trạng sân
  },
  { timestamps: true }
);

export default mongoose.model("Field", sanBongSchema);
