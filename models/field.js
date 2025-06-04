import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const sanBongSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    people: { type: String, required: true }, // Số người tối đa
    surface: { type: String }, // loại mặt sân,
    foolballFieldId: {
      type: ObjectId,
      ref: "FootballField"
    },
    status: { type: String, enum: ["Hoạt động", "Bảo trì"], default: "Hoạt động" }, // Tình trạng sân
  },
  { timestamps: true }
);

export default mongoose.model("Field", sanBongSchema);
