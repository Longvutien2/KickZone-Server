import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const PaymentOrder = new mongoose.Schema({
  sepayId: {
    type: String,
  },
  userId: {
    type: ObjectId,
    ref: "User",
  },
  bookingId: {
    type: ObjectId,
    ref: "Booking",
  },
  fieldName: {
    type: String,
  },
  timeStart: {
    type: String,
  },
  date: {
    type: String,
  },
  gateway: {
    type: String,
  },
  transactionDate: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  amount: {
    type: Number,
  },
  content: {
    type: String,
  },
  teamName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model("PaymentOrder", PaymentOrder);