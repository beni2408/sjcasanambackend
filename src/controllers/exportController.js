import ExcelJS from "exceljs";
import donationModel from "../models/donationModel.js";

export const exportDonationsToExcel = async (req, res) => {
  try {
    const { name, paymentMode, sortBy, order } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (paymentMode) filter.paymentMode = paymentMode;

    const sortOptions = {};
    if (sortBy && order) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const donations = await donationModel.find(filter).sort(sortOptions);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Donations");

    let filterInfo = "Filter: ";
    if (name) filterInfo += `Name contains "${name}" | `;
    if (paymentMode) filterInfo += `Payment Mode: ${paymentMode} | `;
    if (sortBy && order) filterInfo += `Sorted by ${sortBy} (${order}) | `;
    if (filterInfo === "Filter: ") filterInfo = "Filter: All Donations";

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = filterInfo;
    worksheet.getCell('A1').font = { bold: true, size: 12 };
    worksheet.getCell('A1').alignment = { horizontal: 'left' };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow(["S.No", "Name", "Amount", "Address", "Payment Method", "Receipt No"]);
    headerRow.font = { bold: true };

    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(3).alignment = { horizontal: 'left' };
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;

    donations.forEach((donation, index) => {
      worksheet.addRow([
        index + 1,
        donation.name,
        donation.donated_amount,
        donation.address,
        donation.paymentMode === "HAND" ? "CASH" : donation.paymentMode,
        donation.receiptNumber,
      ]);
    });

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
