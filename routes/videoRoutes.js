import express from "express";
import { uploadClientVideo, getMyVideos, getReviewQueue, markReviewed } from "../controllers/videoController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadVideo } from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protect, authorize("client"), uploadVideo.single("video"), uploadClientVideo);
router.get("/me", protect, authorize("client"), getMyVideos);
router.get("/queue", protect, authorize("coach"), getReviewQueue);
router.patch("/:id/review", protect, authorize("coach"), markReviewed);

export default router;
