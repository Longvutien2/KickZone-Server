const express = require("express");
import Booking from "../models/booking"; // Import mô hình Booking

const bookingRouter = express.Router();

// Tạo một booking mới
bookingRouter.post("/", async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body); // Tạo booking mới từ dữ liệu trong body của request
    res.status(200).json(newBooking); // Trả về booking mới tạo
  } catch (error) {
    res.status(500).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
  }
});

// Cập nhật thông tin một booking (sử dụng ID của booking)
bookingRouter.patch("/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedBooking); // Trả về booking đã được cập nhật
  } catch (error) {
    res.status(400).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
  }
});

// Liệt kê tất cả các booking
bookingRouter.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find(); // Lấy tất cả các booking
    res.status(200).json(bookings); // Trả về danh sách tất cả các booking
  } catch (error) {
    res.status(500).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
  }
});

// Xoá một booking theo ID
bookingRouter.delete("/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id); // Tìm và xóa booking theo ID
    res.status(200).json(deletedBooking); // Trả về booking đã xóa
  } catch (error) {
    res.status(400).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
  }
});

export default bookingRouter;
