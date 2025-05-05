import express from "express";
import Team from "../models/team"; // Đảm bảo rằng bạn đã import đúng model

const teamRouter = express.Router();

// 1. Lấy tất cả các đội bóng
teamRouter.get("/", async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Lấy đội bóng theo id
teamRouter.get("/:id", async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate("user members.user");
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

teamRouter.get("/byUser/:userId", async (req, res) => {
    try {
        // Tìm các team mà user là thành viên (có trong members.user)
        const teams = await Team.find({ 
            "members.user": req.params.userId 
        }).populate('user').populate('members.user');
        
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Tạo một đội bóng mới
teamRouter.post("/", async (req, res) => {
    try {
        const newTeam = new Team(req.body); // Tạo mới đội bóng từ body request
        const savedTeam = await newTeam.save(); // Lưu đội bóng vào cơ sở dữ liệu
        res.status(201).json(savedTeam); // Trả về đội bóng đã lưu với mã trạng thái 201
    } catch (error) {
        res.status(400).json({ message: error.message }); // Trả về lỗi nếu có vấn đề
    }
});

// 4. Cập nhật thông tin đội bóng theo id
teamRouter.patch("/:id", async (req, res) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message }); // Trả về lỗi nếu có vấn đề
    }
});
// 5. Xóa đội bóng theo id
teamRouter.delete("/:id", async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        if (!deletedTeam) {
            return res.status(404).json({ message: "Đội bóng không tồn tại" });
        }
        res.status(200).json({ message: "Đội bóng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default teamRouter;
