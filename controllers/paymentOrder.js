import PaymentOrder from "../models/order.js";
import FootballField from "../models/footballField.js";
import { Notification } from '../models/notification.js';

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
        const regex = /DH(.*?\d{10})(?=\s+FT|$)/i;
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
            if (global.io) {
                try {
                    const footballField = await FootballField.findById('67ce9ea74c79326f98b8bf8e');
                    if (footballField && footballField.userId) {
                        global.io.emit('newBookingNotification', {
                            type: 'NEW_BOOKING',
                            order: order,
                            targetUserId: footballField.userId,
                            message: `Sân "${order.fieldName}" đã có người đặt vào lúc ${order.timeStart}, ngày ${order.date}!`
                        });
                    }
                } catch (notificationError) {
                    console.error('Lỗi khi gửi thông báo cho chủ sân:', notificationError);
                }
            }

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

// Lấy orders theo user ID với pagination và tối ưu
export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await PaymentOrder.find({ userId: req.params.id });

        // Sắp xếp theo date và timeStart
        const sortedOrders = orders.sort((a, b) => {
            // Parse date từ format "DD-MM-YYYY"
            const parseDate = (dateStr) => {
                if (!dateStr) return new Date(0);
                const [day, month, year] = dateStr.split('-');
                return new Date(year, month - 1, day);
            };

            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Ưu tiên ngày hiện tại trước
            const isDateAToday = dateA.toDateString() === today.toDateString();
            const isDateBToday = dateB.toDateString() === today.toDateString();

            if (isDateAToday && !isDateBToday) return -1;
            if (!isDateAToday && isDateBToday) return 1;

            // Nếu cùng loại ngày, sắp xếp theo date
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }

            // Nếu cùng ngày, sắp xếp theo timeStart (nhỏ nhất tới lớn nhất)
            const timeA = a.timeStart || '';
            const timeB = b.timeStart || '';
            return timeA.localeCompare(timeB);
        });


        res.status(200).json(sortedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const checkOrderExist = async (req, res) => {
    try {
        const { field, date, time } = req.query;

        const order = await PaymentOrder.findOne({
            fieldName: field,
            timeStart: time,
            date: date,
            paymentStatus: "success"
        });

        if (order) {
            return res.status(200).json({ success: true, message: "Field is booked" });
        }
        return res.status(200).json({ success: false, message: "Field is available" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkUserOrderExist = async (req, res) => {
    try {
        const { field, date, time, userId } = req.query;

        // Tìm đơn hàng đã thanh toán thành công NHƯNG KHÔNG PHẢI của user hiện tại
        const query = {
            fieldName: field,
            timeStart: time,
            date: date,
            paymentStatus: "success"
        };

        // Nếu có userId, loại trừ user này ra khỏi kết quả
        if (userId) {
            query.userId = { $ne: userId }; // $ne = not equal
        }

        const order = await PaymentOrder.findOne(query);

        if (order) {
            return res.status(200).json({ success: true, message: "Field is booked by another user" });
        }
        return res.status(200).json({ success: false, message: "Field is available" });
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
