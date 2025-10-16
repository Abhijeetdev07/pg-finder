import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addFavorite, listFavorites, removeFavorite, updateMe } from "../controllers/user.controller.js";

const router = Router();

router.get("/favorites", requireAuth, listFavorites);
router.post("/favorites/:pgId", requireAuth, addFavorite);
router.delete("/favorites/:pgId", requireAuth, removeFavorite);
router.put("/me", requireAuth, updateMe);

export default router;


