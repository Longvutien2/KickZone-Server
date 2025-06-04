import express from "express";
import {
    getAllMatches,
    getMatchById,
    getMatchesByFootballFieldId,
    getMatchByUserId,
    createMatch,
    updateMatch,
    deleteMatch
} from "../controllers/match.js";

const matchRouter = express.Router();

matchRouter.get("/", getAllMatches);
matchRouter.get("/footballField/:id", getMatchesByFootballFieldId);
matchRouter.get("/byUser/:userId", getMatchByUserId);
matchRouter.get("/:id", getMatchById);
matchRouter.post("/", createMatch);
matchRouter.patch("/:id", updateMatch);
matchRouter.delete("/:id", deleteMatch);

export default matchRouter;
