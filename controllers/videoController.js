import Video from "../models/Video.js";

// POST /api/videos  (client — multipart form upload, handled by uploadVideo middleware)
// body: { lift, weight }, file: video
export async function uploadClientVideo(req, res) {
  const { lift, weight } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video file received." });
  }
  if (!lift || !weight) {
    return res.status(400).json({ message: "lift and weight are required." });
  }

  const video = await Video.create({
    client: req.user._id,
    lift,
    weight,
    videoUrl: req.file.path, // secure_url from Cloudinary
  });

  res.status(201).json({ video });
}

// GET /api/videos/me  (client — their own upload history)
export async function getMyVideos(req, res) {
  const videos = await Video.find({ client: req.user._id }).sort({ createdAt: -1 });
  res.json({ videos });
}

// GET /api/videos/queue  (coach — all pending review, newest first)
export async function getReviewQueue(req, res) {
  const videos = await Video.find({ status: "pending" })
    .populate("client", "name")
    .sort({ createdAt: -1 });
  res.json({ videos });
}

// PATCH /api/videos/:id/review  (coach — mark reviewed, optional note)
export async function markReviewed(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ message: "Video not found." });
  }
  video.status = "reviewed";
  if (req.body.coachNote) video.coachNote = req.body.coachNote;
  await video.save();
  res.json({ video });
}
