import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateCartItemQuantity);
router.delete("/clear", clearCart);

export default router;
