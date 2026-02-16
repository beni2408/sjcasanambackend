import donationModel from "../models/donationModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const donations = await donationModel.find();

    const totalAmount = donations.reduce((sum, d) => sum + d.donated_amount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAmount = donations
      .filter((d) => new Date(d.donationDate) >= today)
      .reduce((sum, d) => sum + d.donated_amount, 0);

    const cashAmount = donations
      .filter((d) => d.paymentMode === "HAND")
      .reduce((sum, d) => sum + d.donated_amount, 0);

    const upiAmount = donations
      .filter((d) => d.paymentMode === "UPI")
      .reduce((sum, d) => sum + d.donated_amount, 0);

    res.json({
      totalAmount,
      todayAmount,
      cashAmount,
      upiAmount,
      donations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
