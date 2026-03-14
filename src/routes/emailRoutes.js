import express from "express";
import { sendReceiptEmail } from "../controllers/emailController.js";
import { protect } from "../middlewares/authMiddleware.js";

const emailRouter = express.Router();

emailRouter.post("/:id", protect, sendReceiptEmail);

export default emailRouter;
