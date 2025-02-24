import mongoose from "mongoose";

// Định nghĩa schema (cấu trúc dữ liệu)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String
});

// Tạo model từ schema
const Product = mongoose.model("Product", productSchema);

export default Product;