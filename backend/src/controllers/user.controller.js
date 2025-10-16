import mongoose from "mongoose";
import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { Pg } from "../models/Pg.js";

export const listFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  const favorites = user?.favorites || [];
  res.status(200).json({ data: favorites });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { pgId } = req.params;
  const { error } = Joi.string().hex().length(24).required().validate(pgId);
  if (error) return res.status(400).json({ message: "Invalid pgId" });
  const exists = await Pg.exists({ _id: pgId });
  if (!exists) return res.status(404).json({ message: "PG not found" });
  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { favorites: new mongoose.Types.ObjectId(pgId) } },
    { new: true }
  );
  res.status(200).json({ message: "PG added to favorites", id: pgId });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { pgId } = req.params;
  const { error } = Joi.string().hex().length(24).required().validate(pgId);
  if (error) return res.status(400).json({ message: "Invalid pgId" });
  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { favorites: new mongoose.Types.ObjectId(pgId) } },
    { new: true }
  );
  res.status(200).json({ message: "PG removed from favorites", id: pgId });
});

const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().max(30).allow("").optional(),
}).min(1);

export const updateMe = asyncHandler(async (req, res) => {
  const { value, error } = updateMeSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const user = await User.findByIdAndUpdate(req.user.id, value, { new: true }).select(
    "name email role phone"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ data: user });
});


