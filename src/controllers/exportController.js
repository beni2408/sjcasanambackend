import ExcelJS from "exceljs";
import donationModel from "../models/donationModel.js";
import { generateReceiptNumber } from "../utils/generateReceiptnumber.js";

export const exportDonationsToExcel = async (req, res) => {
  try {
    const donations = await donationModel.find().sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Donations");

    /* ✅ Define Columns */
    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Address", key: "address", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Amount", key: "donated_amount", width: 12 },
      { header: "Payment Mode", key: "paymentMode", width: 15 },
      { header: "Transaction ID", key: "transactionId", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Donation Date", key: "donationDate", width: 18 },
    ];

    /* ✅ Add Rows */
    donations.forEach((donation) => {
      worksheet.addRow({
        ...donation._doc,
        donationDate: donation.donationDate?.toISOString().split("T")[0],
      });
    });

    /* ✅ Response Headers */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", "attachment; filename=donations.xlsx");

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
