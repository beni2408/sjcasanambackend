import express from "express";
import { generatePDFReceipt } from "../controllers/pdfController.js";
import { protect } from "../middlewares/authMiddleware.js";

const pdfRouter = express.Router();

pdfRouter.get("/:id", protect, generatePDFReceipt);

export default pdfRouter;
