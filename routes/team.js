import express from "express";
import {
    getAllTeams,
    getTeamById,
    getTeamsByUserId,
    createTeam,
    updateTeam,
    deleteTeam
} from "../controllers/team.js";

const teamRouter = express.Router();

teamRouter.get("/", getAllTeams);
teamRouter.get("/byUser/:userId", getTeamsByUserId);
teamRouter.get("/:id", getTeamById);
teamRouter.post("/", createTeam);
teamRouter.patch("/:id", updateTeam);
teamRouter.delete("/:id", deleteTeam);

export default teamRouter;
