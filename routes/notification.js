import express from 'express';
import { Notification } from '../models/notification'; // Import Notification model
import footballField from '../models/footballField';
// import { FootballField } from '../models/footballField'; // Import Notification model

const notificationRouter = express.Router();

// Route thêm mới thông báo
notificationRouter.post("/", async (req, res) => {
    try {
        // Tạo mới thông báo từ body request
        const newNotification = new Notification(req.body);

        // Lưu thông báo vào cơ sở dữ liệu
        const savedNotification = await newNotification.save();

        // Gửi thông báo real-time qua socket.io
        if (global.io) {
            global.io.emit('pushNotification', savedNotification);
            console.log("Đã gửi thông báo real-time:", savedNotification);
        } else {
            console.warn("Socket.io chưa được khởi tạo, không thể gửi thông báo real-time");
        }

        // Xử lý kết nối socket
        global.io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('A user disconnected:', socket.id);
            });
        });

        // Trả về thông báo đã được lưu
        res.status(201).json(savedNotification);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

notificationRouter.get("/", async (req, res) => {
    try {
        const notification = await Notification.find().populate("bookingId orderId footballfield club_A club_B match"); // Lấy tất cả các booking
        res.status(200).json(notification); // Trả về danh sách tất cả các booking
    } catch (error) {
        res.status(500).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
    }
});

notificationRouter.get("/detail/:id", async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id }).populate("bookingId orderId footballfield club_A club_B match"); // Lấy tất cả các booking
        res.status(200).json(notification); // Trả về danh sách tất cả các booking
    } catch (error) {
        res.status(500).json({ message: error.message }); // Nếu có lỗi, trả về thông báo lỗi
    }
});

notificationRouter.get("/:userId/:role", async (req, res) => {
    try {
        const { userId, role } = req.params;
        if (!userId || !role) {
            return res.status(400).json({ error: "Missing userId or role" });
        }

        const data = await Notification.find({ targetUser: userId, actor: role }).populate("bookingId orderId footballfield club_A club_B match");
        // const football = await footballField.findOne({ userId: userId });

        // if (!football || !data) {
        //     return res.status(404).json({ error: "Data not found" });
        // }
        // let filteredData = [];
        // if (role === "manager") {
        //     const newDataForUser = data.filter(
        //         (item) => item.actor === "user" && String(item.targetUser) === userId
        //     );
        //     const newDataForManager = data.filter(
        //         (item) => item.actor === "manager" && String(item.footballfield?._id) === String(football._id)
        //     );

        //     filteredData = [...newDataForUser, ...newDataForManager];
        //    } else {
        //     filteredData = data.filter(
        //         (item) => item.actor === "user" && String(item.targetUser) === userId
        //     );
        // }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


notificationRouter.get("/role/manager/:role", async (req, res) => {
    try {
        const data = await Notification.find({ actor: req.params.role }).populate("bookingId orderId footballfield club_A club_B match");
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



notificationRouter.patch("/:id", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Gửi thông báo real-time qua socket.io
        if (global.io) {
            global.io.emit('updateNotification', notification);
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default notificationRouter;
