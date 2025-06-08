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

// Xóa thông báo theo ID
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully", notification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa tất cả thông báo của một user
export const deleteNotificationsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const result = await Notification.deleteMany({ targetUser: userId });
        res.status(200).json({
            message: `Deleted ${result.deletedCount} notifications for user ${userId}`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa thông báo cũ, giữ lại số lượng mới nhất
export const deleteOldNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const { keep = 10 } = req.query; // Mặc định giữ lại 10 cái mới nhất

        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        // Lấy danh sách notifications của user, sắp xếp theo thời gian tạo (mới nhất trước)
        const notifications = await Notification.find({ targetUser: userId })
            .sort({ createdAt: -1 });

        // Nếu số lượng notifications <= keep, không cần xóa
        if (notifications.length <= parseInt(keep)) {
            return res.status(200).json({
                message: `User has ${notifications.length} notifications, no need to delete`,
                deletedCount: 0
            });
        }

        // Lấy danh sách ID của những notifications cần xóa (từ vị trí keep trở đi)
        const notificationsToDelete = notifications.slice(parseInt(keep));
        const idsToDelete = notificationsToDelete.map(n => n._id);

        // Xóa những notifications cũ
        const result = await Notification.deleteMany({ _id: { $in: idsToDelete } });

        res.status(200).json({
            message: `Deleted ${result.deletedCount} old notifications, kept ${keep} newest`,
            deletedCount: result.deletedCount,
            keptCount: parseInt(keep)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
