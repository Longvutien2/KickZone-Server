import express from "express";
import {
    checkWebhooks,
    createOrder,
    handleWebhook,
    checkPaymentStatus,
    getOrders,
    getOrderDetails,
    getOrdersByUserId,
    getAllOrders,
    cleanupPendingOrders,
    updatePendingOrder,
    checkOrderExist,
    checkUserOrderExist,
} from "../controllers/paymentOrder.js";

const paymentSepay = express.Router();

// API để kiểm tra webhook đã nhận
paymentSepay.get("/webhooks", checkWebhooks);

// Tạo order mới
paymentSepay.post("/create-order", createOrder);

// Xử lý webhook từ SePay
paymentSepay.post("/", handleWebhook);

// Kiểm tra trạng thái thanh toán
paymentSepay.get("/check-payment/:orderId", checkPaymentStatus);
paymentSepay.get("/check-exist", checkOrderExist);
paymentSepay.get("/check-user-exist", checkUserOrderExist);

paymentSepay.get("/orders", getOrders);
paymentSepay.get("/orders/:orderId", getOrderDetails);
paymentSepay.get("/userId/:id", getOrdersByUserId);
paymentSepay.get("/listorders", getAllOrders);
paymentSepay.delete("/cleanup-pending-orders", cleanupPendingOrders);
paymentSepay.put("/update-pending-order/:orderId", updatePendingOrder);

export default paymentSepay;
