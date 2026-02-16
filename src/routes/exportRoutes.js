import express from "express";
import { exportDonationsToExcel } from "../controllers/exportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const exportRouter = express.Router();

exportRouter.get("/excel", protect, exportDonationsToExcel);

export default exportRouter;
