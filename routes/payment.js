import express from "express";
import PaymentOrder from "../models/order";

const paymentSepay = express.Router();

// Hàm chuyển đổi nội dung từ định dạng DB sang định dạng SePay
function convertContentToSepayFormat(content) {
    if (!content) return '';

    // Loại bỏ dấu tiếng Việt
    let result = content.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

    // Chuyển đổi định dạng ngày từ "20-05-2025" thành "20052025"
    result = result.replace(/(\d{2})-(\d{2})-(\d{4})/g, '$1$2$3');

    // Chuyển đổi định dạng giờ từ "09:00 - 10:30" thành "0900 1030"
    result = result.replace(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/g, '$1$2 $3$4');

    // Loại bỏ các ký tự đặc biệt không cần thiết và thay thế nhiều dấu cách bằng một dấu cách
    result = result.replace(/[^\w\s\d]/g, ' ').replace(/\s+/g, ' ').trim();

    return result;
}

// Ví dụ sử dụng:
// const dbContent = 'Sân của long 20-05-2025 09:00 - 10:30';
// const sepayFormat = convertContentToSepayFormat(dbContent);
// console.log(sepayFormat); // "San cua long 20052025 0900 1030"

// API để kiểm tra webhook đã nhận
paymentSepay.get("/webhooks", async (req, res) => {
    try {
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

});

paymentSepay.post("/create-order", async (req, res) => {

    const order = {
        ...req.body,
        content: convertContentToSepayFormat(req.body.content)
    }
    try {
        const newOrder = new PaymentOrder(order);
        const savedOrder = await newOrder.save();
        console.log("Đã lưu thành công vào database:", savedOrder);
        res.status(200).json(savedOrder);
    } catch (saveError) {
        console.error("Lỗi khi lưu vào database:", saveError);
        res.status(200).json({
            success: false,
            message: "Đã nhận webhook nhưng không lưu được vào database",
            error: saveError.message
        });
    }

});


// Xử lý webhook từ SePay
paymentSepay.post("/", async (req, res) => {
    try {
        // Log toàn bộ request body để debug
        console.log("SePay webhook received:", req.body);

        const regex = /DH(.*?)(?=\s+FT|$)/i;
        let match = req.body.content.match(regex);

        if (match && match[1]) {
            // Đảm bảo loại bỏ tất cả khoảng trắng thừa
            match = match[1].trim().replace(/\s+/g, ' ');
            console.log("match", match);

            // Tìm order với nội dung chính xác
            const order = await PaymentOrder.findOne({ content: match });

            if (order) {
                console.log("đã tháy order", order);
                const orderUpdate = await PaymentOrder.findOneAndUpdate(
                    { sepayId: order.sepayId },
                    {
                        paymentStatus: "success",
                        transactionDate: req.body.transactionDate
                    },
                    { new: true }
                );
                console.log("orderUpdate", orderUpdate);

                return res.status(200).json({ success: true, order: orderUpdate });
                ;
            }
        }

        // Trả về response cho SePay - QUAN TRỌNG: SePay cần nhận được status code 200
        res.status(200).json({ success: true, message: "Webhook received but no order found" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        // Vẫn trả về 200 để SePay không gửi lại webhook
        res.status(200).json({ success: false, message: error.message });
    }
});


// Kiểm tra trạng thái thanh toán
paymentSepay.get("/check-payment/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await PaymentOrder.findOne({ sepayId: orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.paymentStatus === "success") {
            return res.status(200).json({ success: true, order: order });
        }

        return res.status(200).json({ success: false, message: "Thanh toán chưa thành công" });

    } catch (error) {
        console.error("Error checking payment status:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Xử lý callback khi người dùng được redirect từ SePay về
// paymentSepay.get("/callback", async (req, res) => {
//     try {
//         // Log query params để debug
//         console.log("SePay callback received:", req.query);

//         const { order_id, status } = req.query;

//         // Redirect người dùng đến trang kết quả thanh toán
//         if (status === "success") {
//             res.redirect(`/payment-success?order_id=${order_id}`);
//         } else {
//             res.redirect(`/payment-failed?order_id=${order_id}`);
//         }
//     } catch (error) {
//         console.error("Error processing SePay callback:", error);
//         res.status(500).json({ message: error.message });
//     }
// });




// Lấy danh sách đơn hàng

paymentSepay.get("/orders", async (req, res) => {
    try {
        const { status, userId, page = 1, limit = 10 } = req.query;

        // Xây dựng query
        const query = {};

        if (status) {
            query.status = status;
        }

        if (userId) {
            query.userId = userId;
        }

        // Tính toán skip để phân trang
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Lấy tổng số đơn hàng
        const total = await PaymentOrder.countDocuments(query);

        // Lấy danh sách đơn hàng
        const orders = await PaymentOrder.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'name email')
            .populate('bookingId');

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
            orders
        });
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy chi tiết đơn hàng
paymentSepay.get("/orders/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await PaymentOrder.findOne({ orderId })
            .populate('userId', 'name email')
            .populate('bookingId');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error getting order details:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

paymentSepay.get("/userId/:id", async (req, res) => {
    try {
        const orders = await PaymentOrder.find({ userId: req.params.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


paymentSepay.get("/listorders", async (req, res) => {
    try {
        const orders = await PaymentOrder.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API để xóa các orders pending quá 10 phút
paymentSepay.delete("/cleanup-pending-orders", async (req, res) => {
    try {
        // Tính thời gian 10 phút trước
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        // Xóa các orders có paymentStatus = "pending" và được tạo trước 10 phút
        const result = await PaymentOrder.deleteMany({
            paymentStatus: "pending",
            createdAt: { $lt: tenMinutesAgo }
        });

        console.log(`Đã xóa ${result.deletedCount} orders pending cũ`);

        res.status(200).json({
            success: true,
            message: `Đã xóa ${result.deletedCount} orders pending cũ`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Lỗi khi xóa orders pending cũ:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// API để cập nhật thông tin order pending (thay vì tạo mới)
paymentSepay.put("/update-pending-order/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const updateData = req.body;

        // Tìm và cập nhật order pending
        const updatedOrder = await PaymentOrder.findOneAndUpdate(
            {
                _id: orderId,
                paymentStatus: "pending"
            },
            {
                ...updateData,
                content: convertContentToSepayFormat(updateData.content || "")
            },
            {
                new: true // Trả về document sau khi update
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy order pending để cập nhật"
            });
        }

        console.log("Đã cập nhật order pending:", updatedOrder);
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Lỗi khi cập nhật order pending:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default paymentSepay;
