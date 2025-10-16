import { Pg } from "../models/Pg.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Joi from "joi";

export const listPgs = asyncHandler(async (req, res) => {
  const {
    city,
    college,
    amenities,
    gender,
    minPrice,
    maxPrice,
    q,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const filter = {};
  if (city) filter.city = city;
  if (college) filter.college = college;
  if (gender) filter.gender = gender;
  if (amenities) filter.amenities = { $all: String(amenities).split(",") };
  if (minPrice || maxPrice) {
    filter.rent = {};
    if (minPrice) filter.rent.$gte = Number(minPrice);
    if (maxPrice) filter.rent.$lte = Number(maxPrice);
  }
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Pg.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Pg.countDocuments(filter),
  ]);
  res.status(200).json({ data: items, meta: { total, page: Number(page), limit: Number(limit) } });
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
  gender: Joi.string().valid("male", "female", "any"),
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
    gender: Joi.string().valid("male", "female", "any").default("any"),
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
  const pg = await Pg.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    value,
    { new: true }
  );
  if (!pg) return res.status(404).json({ message: "PG not found" });
  res.status(200).json({ data: pg });
});

export const deletePg = asyncHandler(async (req, res) => {
  const pg = await Pg.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
  if (!pg) return res.status(404).json({ message: "PG not found" });
  res.status(200).json({ message: "PG deleted successfully", id: String(pg._id) });
});


