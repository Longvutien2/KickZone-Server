import Team from "../models/team.js";

// Lấy tất cả các đội bóng
export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đội bóng theo ID
export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate("user members.user");
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đội bóng theo user ID
export const getTeamsByUserId = async (req, res) => {
    try {
        // Tìm các team mà user là thành viên (có trong members.user)
        const teams = await Team.find({ "user": req.params.userId }).populate('user');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo một đội bóng mới
export const createTeam = async (req, res) => {
    try {
        const newTeam = new Team(req.body);
        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin đội bóng theo ID
export const updateTeam = async (req, res) => {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa đội bóng theo ID
export const deleteTeam = async (req, res) => {
    try {
        const deletedTeam = await Team.findByIdAndDelete(req.params.id);
        if (!deletedTeam) {
            return res.status(404).json({ message: "Đội bóng không tồn tại" });
        }
        res.status(200).json({ message: "Đội bóng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
