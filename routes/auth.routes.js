import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  validateResetToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:resettoken", validateResetToken);
router.put("/reset-password/:resettoken", resetPassword);

export default router;
