import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
    },

    donated_amount: {
      type: Number,
      required: true,
      index: true,
    },

    paymentMode: {
      type: String,
      enum: ["HAND", "UPI"],
      required: true,
    },

    transactionId: {
      type: String,
    },

    description: {
      type: String,
    },

    donationDate: {
      // ⭐ NEW FIELD
      type: Date,
      required: true,
      index: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const donationModel = mongoose.model("Donation", donationSchema);

export default donationModel;
