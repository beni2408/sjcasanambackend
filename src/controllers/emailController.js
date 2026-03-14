import donationModel from "../models/donationModel.js";
import axios from "axios";

export const sendReceiptEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    await axios.post("http://127.0.0.1:5678/webhook-test/send-receipt-email", {
      donation,
    });

    res.json({
      message: "Email request sent to automation workflow",
    });
  } catch (error) {
    console.log("❌ Email Controller Error →", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
