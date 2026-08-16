import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for lift-check videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "team-paggu/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"],
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

export default cloudinary;
