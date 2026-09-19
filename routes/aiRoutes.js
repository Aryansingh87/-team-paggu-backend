import express from "express";
import { generateProgramDraft, askCoachBot } from "../controllers/aiController.js";
import { protect, authorize } from "./middleware/auth.js";
import asyncHandler from "./utils/asyncHandler.js";

const router = express.Router();

router.post("/generate-program", protect, authorize("coach"), asyncHandler(generateProgramDraft));
router.post("/ask", protect, asyncHandler(askCoachBot));

export default router;