import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }
  const urls = (req.files || [])
    .map((f) => f?.path || f?.secure_url)
    .filter(Boolean);
  if (urls.length === 0) {
    return res.status(500).json({ message: "Upload failed" });
  }
  res.status(201).json({ data: urls });
});


