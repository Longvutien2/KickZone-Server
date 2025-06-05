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
    origin: "*", // Tạm thời allow all origins
    methods: ["GET", "POST"],
    credentials: false
  }
});

global.io = io;
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // // Xử lý sự kiện khi client gửi tin nhắn
  // socket.on('chatMessage', (message) => {
  //   console.log('Received message:', message);
  //   // Gửi tin nhắn đến tất cả client
  //   io.emit('chatMessage', message);
  // });
  
  // // Xử lý sự kiện khi client tham gia phòng
  // socket.on('joinRoom', (roomId) => {
  //   socket.join(roomId);
  //   console.log(`User ${socket.id} joined room: ${roomId}`);
  //   // Thông báo cho các client khác trong phòng
  //   socket.to(roomId).emit('userJoined', { userId: socket.id });
  // });
  
  // // Xử lý sự kiện khi client rời phòng
  // socket.on('leaveRoom', (roomId) => {
  //   socket.leave(roomId);
  //   console.log(`User ${socket.id} left room: ${roomId}`);
  //   // Thông báo cho các client khác trong phòng
  //   socket.to(roomId).emit('userLeft', { userId: socket.id });
  // });
  
  // Xử lý sự kiện khi client ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// 🚀 CORS config cho production
app.use(cors({
  origin: "*", // Tạm thời allow all origins
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Để đọc dữ liệu JSON từ request

// router
app.use("/api", userRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/footballField", footballField);
app.use("/api/notification", notificationRouter);
app.use("/api/team", teamRouter);
app.use("/api/match", matchRouter);
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
