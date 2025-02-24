import express from "express";
import mongoose from "mongoose";
import Product from "./models/product.js"; // Import model Product

const app = express();
app.use(express.json()); // Để đọc dữ liệu JSON từ request

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/football", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Kết nối MongoDB thành công!"))
.catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route thêm sản phẩm vào MongoDB
// app.post("/products", async (req, res) => {
//   try {
//     const newProduct = new Product(req.body);
//     await newProduct.save();
//     res.status(201).json({ message: "Sản phẩm đã được thêm!", product: newProduct });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Route lấy danh sách sản phẩm
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Khởi động server
app.listen(8000, () => console.log("🚀 Server đang chạy tại http://localhost:8000"));
