import donationModel from "../models/donationModel.js";
import { generateReceiptNumber } from "../utils/generateReceiptnumber.js";
import axios from "axios";

// export const addDonation = async (req, res) => {
//   try {
//     const {
//       name,
//       address,
//       phone,
//       email,
//       donated_amount,
//       paymentMode,
//       transactionId,
//       description,
//       donationDate, // ⭐ NEW
//     } = req.body;

//     // ✅ Validation
//     if (!name || !address || !donated_amount || !paymentMode || !donationDate) {
//       return res.status(400).json({
//         message: "Missing required fields",
//       });
//     }

//     if (paymentMode === "UPI" && !transactionId) {
//       return res.status(400).json({
//         message: "Transaction ID required for UPI payments",
//       });
//     }
//     const receiptNumber = await generateReceiptNumber();
//     const donation = await donationModel.create({
//       name,
//       address,
//       phone,
//       email,
//       donated_amount,
//       paymentMode,
//       transactionId,
//       description,
//       donationDate,
//       receiptNumber, // ⭐ STORED
//     });

//     res.status(201).json(donation);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const addDonation = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      donated_amount,
      paymentMode,
      transactionId,
      description,
      donationDate,
    } = req.body;

    if (!name || !address || !donated_amount || !paymentMode || !donationDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (paymentMode === "UPI" && !transactionId) {
      return res.status(400).json({
        message: "Transaction ID required for UPI payments",
      });
    }

    const receiptNumber = await generateReceiptNumber();

    const donation = await donationModel.create({
      name,
      address,
      phone,
      email,
      donated_amount,
      paymentMode,
      transactionId,
      description,
      donationDate,
      receiptNumber,
    });

    /* ⭐⭐⭐⭐⭐ SYNC TO SHEETS ⭐⭐⭐⭐⭐ */
    axios
      .post("http://127.0.0.1:5678/webhook/data-entry", {
        donation, // ✅ wrapped payload (important)
      })
      .catch((err) => {
        console.log("❌ n8n ERROR →", err.message);
      });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDonations = async (req, res) => {
  const {
    name,
    receiptNumber,
    paymentMode,
    minAmount,
    maxAmount,
    sortBy,
    order,
  } = req.query;

  let filter = {};

  /* ✅ NAME FILTER */
  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  /* ✅ RECEIPT NUMBER FILTER */
  if (receiptNumber) {
    filter.receiptNumber = { $regex: receiptNumber, $options: "i" };
  }

  /* ✅ PAYMENT FILTER */
  if (paymentMode) {
    filter.paymentMode = paymentMode;
  }

  /* ✅ AMOUNT RANGE FILTER 💰🔥 */
  if (minAmount || maxAmount) {
    filter.donated_amount = {};

    if (minAmount) filter.donated_amount.$gte = Number(minAmount);

    if (maxAmount) filter.donated_amount.$lte = Number(maxAmount);
  }

  /* ✅ SORTING */
  let sort = {};

  if (sortBy) {
    sort[sortBy] = order === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  const donations = await donationModel.find(filter).sort(sort);

  res.json(donations);
};

// export const updateDonation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const donation = await donationModel.findById(id);

//     if (!donation) {
//       return res.status(404).json({
//         message: "Donation not found",
//       });
//     }

//     const {
//       name,
//       address,
//       phone,
//       email,
//       donated_amount,
//       paymentMode,
//       transactionId,
//       description,
//       donationDate,
//     } = req.body;

//     // ✅ Accounting validation ⭐⭐⭐⭐⭐
//     if (paymentMode === "UPI" && !transactionId) {
//       return res.status(400).json({
//         message: "Transaction ID required for UPI payments",
//       });
//     }

//     donation.name = name ?? donation.name;
//     donation.address = address ?? donation.address;
//     donation.phone = phone ?? donation.phone;
//     donation.email = email ?? donation.email;
//     donation.donated_amount = donated_amount ?? donation.donated_amount;
//     donation.paymentMode = paymentMode ?? donation.paymentMode;
//     donation.transactionId = transactionId ?? donation.transactionId;
//     donation.description = description ?? donation.description;
//     donation.donationDate = donationDate ?? donation.donationDate;

//     const updatedDonation = await donation.save();

//     res.json(updatedDonation);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }

//   axios
//     .post("http://127.0.0.1:5678/webhook/data-update", {
//       action: "UPDATE",
//       donation: updatedDonation,
//     })
//     .catch((err) => {
//       console.log("❌ n8n UPDATE ERROR →", err.message);
//     });
// };

export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    const {
      name,
      address,
      phone,
      email,
      donated_amount,
      paymentMode,
      transactionId,
      description,
      donationDate,
    } = req.body;

    if (paymentMode === "UPI" && !transactionId) {
      return res.status(400).json({
        message: "Transaction ID required for UPI payments",
      });
    }

    donation.name = name ?? donation.name;
    donation.address = address ?? donation.address;
    donation.phone = phone ?? donation.phone;
    donation.email = email ?? donation.email;
    donation.donated_amount = donated_amount ?? donation.donated_amount;
    donation.paymentMode = paymentMode ?? donation.paymentMode;
    donation.transactionId = transactionId ?? donation.transactionId;
    donation.description = description ?? donation.description;
    donation.donationDate = donationDate ?? donation.donationDate;

    const updatedDonation = await donation.save();

    /* ⭐ SYNC UPDATE TO n8n */
    axios
      .post("http://127.0.0.1:5678/webhook/data-update", {
        action: "UPDATE",
        donation: updatedDonation,
      })
      .catch((err) => {
        console.log("❌ n8n UPDATE ERROR →", err.message);
      });

    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const deleteDonation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const donation = await donationModel.findByIdAndDelete(id);

//     if (!donation) {
//       return res.status(404).json({
//         message: "Donation not found",
//       });
//     }

//     res.json({ message: "Donation deleted successfully" });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findByIdAndDelete(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    /* ⭐⭐⭐⭐⭐ SYNC DELETE TO SHEETS ⭐⭐⭐⭐⭐ */
    axios
      .post("http://127.0.0.1:5678/webhook/data-delete", {
        action: "DELETE",
        donation,
      })
      .catch((err) => {
        console.log("❌ n8n DELETE ERROR →", err.message);
      });

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
