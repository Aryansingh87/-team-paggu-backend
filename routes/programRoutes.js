import express from "express";
import { assignProgram, getMyLatestProgram, getClientPrograms } from "../controllers/programController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("coach"), assignProgram);
router.get("/me", protect, authorize("client"), getMyLatestProgram);
router.get("/client/:clientId", protect, authorize("coach"), getClientPrograms);

export default router;
