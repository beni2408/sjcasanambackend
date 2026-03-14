import donationModel from "../models/donationModel.js";
import axios from "axios";

export const sendReceiptToCustomEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    await axios.post("http://127.0.0.1:5678/webhook/send-receipt-email", {
      donation,
      email,
    });

    res.json({
      message: "Receipt sent successfully",
    });
  } catch (error) {
    console.log("Custom Email Error →", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
