import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./src/config/connectDB.js";
import authRoutes from "./src/routes/authRoutes.js";
import donationRouter from "./src/routes/donationRoutes.js";
import exportRouter from "./src/routes/exportRoutes.js";
import receiptRouter from "./src/routes/reciptRoutes.js";
import pdfRouter from "./src/routes/pdfRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import emailRouter from "./src/routes/emailRoutes.js";
import customEmailRouter from "./src/routes/customEmailRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRouter);
app.use("/api/export", exportRouter);
app.use("/api/print-receipt", receiptRouter);
app.use("/api/pdf-receipt", pdfRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/send-email", emailRouter);
app.use("/api/send-custom-email", customEmailRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
