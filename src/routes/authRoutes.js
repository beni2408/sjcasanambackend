import express from "express";
import { createAdmin, loginAdmin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/create-admin", createAdmin);
authRouter.post("/login", loginAdmin);

export default authRouter;
