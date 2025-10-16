import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    // eslint-disable-next-line no-console
    console.warn("Cloudinary env vars missing: CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET");
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  return true;
}

export function createUploadMiddleware(folder = "pg-hub") {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
      folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      use_filename: true,
      unique_filename: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    }),
  });
  return multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
}

export { cloudinary };


