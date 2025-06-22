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
    
    MATCH_REQUEST: 'match_request',         // Yêu cầu tham gia trận đấu
    REQUEST_SENT: 'request_sent',          // Đã gửi yêu cầu
    REQUEST_ACCEPTED: 'request_accepted',  // Yêu cầu được chấp nhận
    REQUEST_REJECTED: 'request_rejected',  // Yêu cầu bị từ chối
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

// ✅ Thêm indexes TRƯỚC khi tạo model
notificationSchema.index({ targetUser: 1, actor: 1 });
notificationSchema.index({ targetUser: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ actor: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export { Notification, ActorType, NotificationType };
