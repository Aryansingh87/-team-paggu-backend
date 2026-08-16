import express from "express";
import { getClients, getCoach } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/clients", protect, authorize("coach"), getClients);
router.get("/coach", protect, getCoach);

export default router;
