import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    },
  },
  { timestamps: true }
);

const donationModel = mongoose.model("Donation", donationSchema);

export default donationModel;
