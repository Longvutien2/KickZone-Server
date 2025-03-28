import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/auth.js"; // Import model Product
import fieldRoutes from "./routes/fields.js"; // Import model Product

import cors from 'cors';
import timeSlotRouter from "./routes/timeSlot.js";
import footballField from "./routes/footballField.js";
import bookingRouter from "./routes/booking.js";
import notificationRouter from "./routes/notification.js";
import teamRouter from "./routes/team.js";
import matchRouter from "./routes/match.js";
import home from "./routes/home.js";

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json()); // Để đọc dữ liệu JSON từ request

// router
app.use("/api", userRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/footballField", footballField);
app.use("/api/booking", bookingRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/team", teamRouter);
app.use("/api/match", matchRouter);

app.use("/home", home);

// Kết nối MongoDB
mongoose.connect("mongodb+srv://longvutien:giongid@cluster0.e5gby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));


// Khởi động server
app.listen(8000, () => console.log(`Server is running on port`));
