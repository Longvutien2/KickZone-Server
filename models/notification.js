import mongoose from 'mongoose';
const { Schema } = mongoose;
import { ObjectId } from "mongodb";

// Enum cho Actor và NotificationType (đã giải thích ở trên)
const ActorType = {
    USER: 'user',
    MANAGER: 'manager',
    ADMIN: 'admin',
};

const NotificationType = {
    FIELD_BOOKED: 'field_booked',           // Đặt sân thành công
    FIELD_BOOKING_FAILED: 'field_booking_failed',  // Đặt sân thất bại
    FIELD_CREATED: 'field_created',         // Tạo sân bóng thành công
    OPPONENT_FOUND: 'opponent_found',       // Tìm đối thủ thành công
    POSTED_OPPONENT: 'posted_opponent',     // Đăng bài tìm đối thành công
    NEW_ORDER: 'new_order',                 // Đơn hàng mới
    FIELD_REGISTRATION_REQUEST: 'field_registration_request', // Yêu cầu đăng ký sân bóng
    USER_FEEDBACK: 'user_feedback',         // Phản hồi từ người dùng
};

// Schema thông báo
const notificationSchema = new Schema({
    actor: {
        type: String,
        enum: Object.values(ActorType),
        // required: true,
    },
    notificationType: {
        type: String,
        enum: Object.values(NotificationType),
        // required: true,
    },
    title: {
        type: String,
        // required: true,
    },
    content: {
        type: String,
    },
    bookingId: {
        type: ObjectId,
        ref: 'Booking',
    },
    orderId: {
        type: ObjectId,
        ref: 'PaymentOrder',
    },
    targetUser: {
        type: ObjectId,
        ref: 'User', // Nếu cần, bạn có thể liên kết với model User
        // required: false,
    },
    footballfield: {
        type: ObjectId,
        ref: 'FootballField',
        // required: false,
    },
    match: {
        type: ObjectId,
        ref: 'Match',
    },
    club_A: {
        type: ObjectId,
        ref: 'Team',
    },
    club_B: {
        type: ObjectId,
        ref: 'Team',
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export { Notification, ActorType, NotificationType };
