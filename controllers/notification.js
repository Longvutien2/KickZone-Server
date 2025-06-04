import { Notification } from '../models/notification.js';

// Tạo mới thông báo
export const createNotification = async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        const savedNotification = await newNotification.save();

        // Gửi thông báo real-time qua socket.io
        if (global.io) {
            global.io.emit('pushNotification', savedNotification);
        }
        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả thông báo
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate("orderId footballfield club_A club_B match");
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết thông báo theo ID
export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id }).populate("orderId footballfield club_A club_B match");
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông báo theo user ID và role
export const getNotificationsByUserAndRole = async (req, res) => {
    try {
        const { userId, role } = req.params;
        if (!userId || !role) {
            return res.status(400).json({ error: "Missing userId or role" });
        }

        const data = await Notification.find({ targetUser: userId, actor: role }).populate("orderId footballfield club_A club_B match");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Lấy thông báo theo role
export const getNotificationsByRole = async (req, res) => {
    try {
        const data = await Notification.find({ actor: req.params.role }).populate("orderId footballfield club_A club_B match");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Cập nhật thông báo
export const updateNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        // Gửi thông báo real-time qua socket.io
        if (global.io) {
            global.io.emit('updateNotification', notification);
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
