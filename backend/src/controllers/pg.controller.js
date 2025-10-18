import { Pg } from "../models/Pg.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cloudinary } from "../config/cloudinary.js";
import Joi from "joi";

// Helper function to delete images from Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;
  
  try {
    const publicIds = imageUrls.map(url => {
      // Extract public_id from Cloudinary URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      const publicId = filename.split('.')[0];
      return `pg-hub/${publicId}`;
    });
    
    await cloudinary.api.delete_resources(publicIds);
    console.log(`Deleted ${publicIds.length} images from Cloudinary`);
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
  }
};

export const listPgs = asyncHandler(async (req, res) => {
  const {
    sort = "-createdAt",
  } = req.query;

  const items = await Pg.find({}).sort(sort);
  res.status(200).json({ data: items, meta: { total: items.length } });
});

export const getPg = asyncHandler(async (req, res) => {
  const pg = await Pg.findById(req.params.id);
  if (!pg) return res.status(404).json({ message: "PG not found" });
  res.status(200).json({ data: pg });
});

// Base schema used for both create and update
const pgBase = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  photos: Joi.array().items(Joi.string()),
  rent: Joi.number(),
  deposit: Joi.number(),
  amenities: Joi.array().items(Joi.string()),
  gender: Joi.string().valid("male", "female", "co-ed"),
  address: Joi.string(),
  city: Joi.string(),
  college: Joi.string().allow(""),
  // location removed
  roomsAvailable: Joi.number(),
});

// Create requires the core fields and sets defaults
const pgCreateSchema = pgBase
  .fork(["title", "description", "rent", "address", "city"], (schema) => schema.required())
  .keys({
    photos: Joi.array().items(Joi.string()).default([]),
    deposit: Joi.number().default(0),
    amenities: Joi.array().items(Joi.string()).default([]),
    gender: Joi.string().valid("male", "female", "co-ed").default("co-ed"),
    location: Joi.object({ lat: Joi.number(), lng: Joi.number() }).default({}),
    roomsAvailable: Joi.number().default(0),
  });

// Update allows any subset of fields (at least one)
const pgUpdateSchema = pgBase.min(1);

export const createPg = asyncHandler(async (req, res) => {
  const { value, error } = pgCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const pg = await Pg.create({ ...value, ownerId: req.user.id });
  res.status(201).json({ data: pg });
});

export const updatePg = asyncHandler(async (req, res) => {
  const { value, error } = pgUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  
  // Get the current PG to compare images
  const currentPg = await Pg.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!currentPg) return res.status(404).json({ message: "PG not found" });
  
  // Find images that were removed
  const currentPhotos = currentPg.photos || [];
  const newPhotos = value.photos || [];
  const removedPhotos = currentPhotos.filter(photo => !newPhotos.includes(photo));
  
  // Update the PG
  const pg = await Pg.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    value,
    { new: true }
  );
  
  // Delete removed images from Cloudinary
  if (removedPhotos.length > 0) {
    await deleteCloudinaryImages(removedPhotos);
  }
  
  res.status(200).json({ data: pg });
});

export const deletePg = asyncHandler(async (req, res) => {
  const pg = await Pg.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
  if (!pg) return res.status(404).json({ message: "PG not found" });
  
  // Delete all images from Cloudinary when PG is deleted
  if (pg.photos && pg.photos.length > 0) {
    await deleteCloudinaryImages(pg.photos);
  }
  
  res.status(200).json({ message: "PG deleted successfully", id: String(pg._id) });
});

export const listOwnerPgs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    sort = "-createdAt",
  } = req.query;

  const filter = { ownerId: req.user.id };
  const skip = (Number(page) - 1) * Number(limit);
  
  const [items, total] = await Promise.all([
    Pg.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Pg.countDocuments(filter),
  ]);
  
  res.status(200).json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
});


