import express from "express";
import { getPlans } from "../controllers/membershipController.js";

const router = express.Router();

router.get("/", getPlans);

export default router;
