import express from 'express';
import {
    createNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByUserAndRole,
    getNotificationsByRole,
    updateNotification
} from '../controllers/notification.js';

const notificationRouter = express.Router();

notificationRouter.post("/", createNotification);
notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/detail/:id", getNotificationById);
notificationRouter.get("/:userId/:role", getNotificationsByUserAndRole);
notificationRouter.get("/role/manager/:role", getNotificationsByRole);
notificationRouter.patch("/:id", updateNotification);

export default notificationRouter;
