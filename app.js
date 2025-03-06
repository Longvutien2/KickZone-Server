import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/auth.js"; // Import model Product
import fieldRoutes from "./routes/fields.js"; // Import model Product

import cors from 'cors';
import timeSlotRouter from "./routes/timeSlot.js";

const app = express();
app.use(express.json()); // Để đọc dữ liệu JSON từ request
app.use(cors());

// router
app.use("/api", userRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/timeSlot", timeSlotRouter);


// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/football", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// Khởi động server
app.listen(8000, () => console.log("🚀 Server đang chạy tại http://localhost:8000"));
