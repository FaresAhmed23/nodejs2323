import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);

export default router;
