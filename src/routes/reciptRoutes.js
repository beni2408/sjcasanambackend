import express from "express";
import { generateReceipt } from "../controllers/reciptController.js";
import { protect } from "../middlewares/authMiddleware.js";

const receiptRouter = express.Router();

receiptRouter.get("/:id", protect, generateReceipt);

export default receiptRouter;
