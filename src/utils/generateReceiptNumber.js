import donationModel from "../models/donationModel.js";

export const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();

  const lastDonation = await donationModel
    .findOne({ receiptNumber: { $regex: `SJC-${year}` } })
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastDonation?.receiptNumber) {
    const lastNumber = parseInt(lastDonation.receiptNumber.split("")[2]);

    nextNumber = lastNumber + 1;
  }

  return `SJC${year}${String(nextNumber).padStart(4, "0")}`;
};
