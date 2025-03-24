import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        date: { type: String, required: true },
        fieldName: { type: String, required: true },
        address: { type: String, required: true },
        field: { type: String, required: true },
        timeStart: { type: String, required: true },
        price: { type: Number, required: true },
        payment_method: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
