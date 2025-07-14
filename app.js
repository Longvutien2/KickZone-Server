import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/auth.js";
import fieldRoutes from "./routes/fields.js";
import cors from 'cors';
import timeSlotRouter from "./routes/timeSlot.js";
import footballField from "./routes/footballField.js";
import notificationRouter from "./routes/notification.js";
import teamRouter from "./routes/team.js";
import matchRouter from "./routes/match.js";
import matchRequestRouter from "./routes/matchRequest.js";
import commentRouter from "./routes/comment.js";
import home from "./routes/home.js";
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import paymentSepay from "./routes/paymentOrder.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  }
});


global.io = io;

app.use(cors());
app.use(express.json());

// router
app.use("/api", userRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/footballField", footballField);
app.use("/api/notification", notificationRouter);
app.use("/api/team", teamRouter);
app.use("/api/match", matchRouter);
app.use("/api/matchRequest", matchRequestRouter);
app.use("/api/comments", commentRouter);
app.use("/api/paymentSepay", paymentSepay);
app.use("/home", home);

// Kết nối MongoDB
mongoose.connect("mongodb+srv://longvutien:giongid@cluster0.e5gby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Khởi động server với socket.io
server.listen(8000, () => console.log(`Server is running on port 8000`));
