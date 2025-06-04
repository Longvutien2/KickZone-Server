import express from "express";
import {
    createTimeSlot,
    updateTimeSlot,
    getTimeSlotsByFootballFieldId,
    getAllTimeSlots,
    getTimeSlotById,
    deleteTimeSlot,
    deleteTimeSlotsByFieldId
} from "../controllers/timeSlot.js";

const timeSlotRouter = express.Router();

timeSlotRouter.post("/", createTimeSlot);
timeSlotRouter.patch("/:id", updateTimeSlot);
timeSlotRouter.get("/:id/idFootBallField", getTimeSlotsByFootballFieldId);
timeSlotRouter.get("/", getAllTimeSlots);
timeSlotRouter.get("/:id", getTimeSlotById);
timeSlotRouter.delete("/:id", deleteTimeSlot);
timeSlotRouter.delete("/byField/:fieldId", deleteTimeSlotsByFieldId);

export default timeSlotRouter;
