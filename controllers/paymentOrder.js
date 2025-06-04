import PaymentOrder from "../models/order.js";

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

// API để kiểm tra webhook đã nhận
export const checkWebhooks = async (req, res) => {
    try {
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Tạo order mới
export const createOrder = async (req, res) => {
    const order = {
        ...req.body,
        content: convertContentToSepayFormat(req.body.content)
    };
    
    try {
        const newOrder = new PaymentOrder(order);
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (saveError) {
        res.status(200).json({
            success: false,
            message: "Đã nhận webhook nhưng không lưu được vào database",
            error: saveError.message
        });
    }
};

// Xử lý webhook từ SePay
export const handleWebhook = async (req, res) => {
    try {
        const regex = /DH(.*?)(?=\s+FT|$)/i;
        let match = req.body.content.match(regex);

        if (match && match[1]) {
            match = match[1].trim().replace(/\s+/g, ' ');
            const order = await PaymentOrder.findOne({ content: match });
            if (order) {
                const orderUpdate = await PaymentOrder.findOneAndUpdate(
                    { sepayId: order.sepayId },
                    {
                        paymentStatus: "success",
                        transactionDate: req.body.transactionDate
                    },
                    { new: true }
                );
                return res.status(200).json({ success: true, order: orderUpdate });
            }
        }

        // Trả về response cho SePay - QUAN TRỌNG: SePay cần nhận được status code 200
        res.status(200).json({ success: true, message: "Webhook received but no order found" });
    } catch (error) {
        // Vẫn trả về 200 để SePay không gửi lại webhook
        res.status(200).json({ success: false, message: error.message });
    }
};

// Kiểm tra trạng thái thanh toán
export const checkPaymentStatus = async (req, res) => {
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
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách đơn hàng
export const getOrders = async (req, res) => {
    try {
        const { status, userId, page = 1, limit = 10 } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (userId) {
            query.userId = userId;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await PaymentOrder.countDocuments(query);
        const orders = await PaymentOrder.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'name email')

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
            orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await PaymentOrder.findOne({ orderId })
            .populate('userId', 'name email')

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy orders theo user ID
export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await PaymentOrder.find({ userId: req.params.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await PaymentOrder.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// API để xóa các orders pending quá 10 phút
export const cleanupPendingOrders = async (req, res) => {
    try {
        // Tính thời gian 10 phút trước
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        // Xóa các orders có paymentStatus = "pending" và được tạo trước 10 phút
        const result = await PaymentOrder.deleteMany({
            paymentStatus: "pending",
            createdAt: { $lt: tenMinutesAgo }
        });

        res.status(200).json({
            success: true,
            message: `Đã xóa ${result.deletedCount} orders pending cũ`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// API để cập nhật thông tin order pending (thay vì tạo mới)
export const updatePendingOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const updateData = req.body;

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
                new: true
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy order pending để cập nhật"
            });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
