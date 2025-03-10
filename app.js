import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/auth.js"; // Import model Product
import fieldRoutes from "./routes/fields.js"; // Import model Product

import cors from 'cors';
import timeSlotRouter from "./routes/timeSlot.js";
import footballField from "./routes/footballField.js";

const app = express();
app.use(cors());
app.use(express.json()); // Để đọc dữ liệu JSON từ request

// router
app.use("/api", userRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/footballField", footballField);



// Kết nối MongoDB
mongoose.connect("mongodb+srv://longvutien:giongid@cluster0.e5gby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// Khởi động server
app.listen(8000, () => console.log("🚀 Server đang chạy tại http://localhost:8000"));
