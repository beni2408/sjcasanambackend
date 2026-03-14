import express from "express";
import { sendReceiptToCustomEmail } from "../controllers/customEmailController.js";
import { protect } from "../middlewares/authMiddleware.js";

const customEmailRouter = express.Router();

customEmailRouter.post("/:id", protect, sendReceiptToCustomEmail);

export default customEmailRouter;
