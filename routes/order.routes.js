import express from "express";
import {
  checkout,
  getOrders,
  getOrderById,
  createCheckoutSession,
} from "../controllers/order.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/checkout", checkout);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/", getOrders);
router.get("/:id", getOrderById);

export default router;
