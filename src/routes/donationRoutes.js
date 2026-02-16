import express from "express";
import {
  addDonation,
  getDonations,
  updateDonation,
  deleteDonation,
} from "../controllers/donationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const donationRouter = express.Router();

donationRouter.post("/", protect, addDonation);
donationRouter.get("/", protect, getDonations);
donationRouter.put("/:id", protect, updateDonation);
donationRouter.delete("/:id", protect, deleteDonation);

export default donationRouter;
