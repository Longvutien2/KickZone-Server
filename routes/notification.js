import express from 'express';
import {
    createNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserAndRole,
    getNotificationsByRole,
    updateNotification,
    deleteNotification,
    deleteNotificationsByUserId,
    deleteOldNotifications
} from '../controllers/notification.js';

const notificationRouter = express.Router();

notificationRouter.post("/", createNotification);
notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/detail/:id", getNotificationById);
notificationRouter.get("/:userId/:role", getNotificationsByUserAndRole);
notificationRouter.get("/role/manager/:role", getNotificationsByRole);
notificationRouter.patch("/:id", updateNotification);

// 🗑️ DELETE routes
notificationRouter.delete("/:id", deleteNotification);                    // Xóa 1 notification theo ID
notificationRouter.delete("/byUser/:userId", deleteNotificationsByUserId); // Xóa tất cả notifications của user
notificationRouter.delete("/user/:userId/old", deleteOldNotifications);   // Xóa notifications cũ

export default notificationRouter;
