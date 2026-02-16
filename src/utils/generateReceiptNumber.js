import donationModel from "../models/donationModel.js";

export const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();

  const lastDonation = await donationModel
    .findOne({ receiptNumber: { $regex: `^SJC${year}` } })
    .sort({ receiptNumber: -1 });

  let nextNumber = 1;

  if (lastDonation?.receiptNumber) {
    const lastNumber = parseInt(lastDonation.receiptNumber.replace(`SJC${year}`, ""));
    nextNumber = lastNumber + 1;
  }

  return `SJC${year}${String(nextNumber).padStart(4, "0")}`;
};
