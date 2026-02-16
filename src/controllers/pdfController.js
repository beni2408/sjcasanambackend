import PDFDocument from "pdfkit";
import donationModel from "../models/donationModel.js";
import https from "https";
import { generateReceiptNumber } from "../utils/generateReceiptnumber.js";

const fetchImage = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
  });
};

export const generatePDFReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const [logoBuffer, signatureBuffer] = await Promise.all([
      fetchImage(
        "https://res.cloudinary.com/dusji1fg2/image/upload/v1771231215/SJC_app_logo-2-SJC_reciept_web_logo_2_ww8vbk.png"
      ),
      fetchImage(
        "https://res.cloudinary.com/dusji1fg2/image/upload/v1771228173/IMG_8382_2_raytz3.jpg"
      ),
    ]);

    const paymentMethod =
      donation.paymentMode.toLowerCase() === "hand"
        ? "CASH"
        : donation.paymentMode.toUpperCase();

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${donation._id}.pdf`
    );

    doc.pipe(res);

    doc.rect(0, 0, 595, 120).fill("#0d3b66");
    doc.image(logoBuffer, 40, 25, { width: 70 });
    doc
      .fontSize(28)
      .fillColor("white")
      .font("Helvetica-Bold")
      .text("ST. JOHN'S CHURCH", 130, 30);
    doc
      .fontSize(13)
      .font("Helvetica")
      .text(
        "Madathuvilai, Arumuganeri , Thoothukudi - Nazareth Diocese",
        130,
        65
      );
    doc
      .fontSize(10)
      .text(" stjohnschurchmadadthuvilai@gmail.com |  +91 9865384841", 130, 85);

    doc.rect(0, 120, 595, 3).fill("#faa307");

    doc
      .fontSize(24)
      .fillColor("#0d3b66")
      .font("Times-Bold")
      .text("ASANAM DONATION RECEIPT 2025", 0, 150, { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#212529")
      .font("Helvetica-Bold")
      .text(`Receipt No: ${donation.receiptNumber}`, 0, 185, {
        align: "center",
      });
    doc.fontSize(10).text(
      `Issued on: ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      0,
      200,
      { align: "center" }
    );

    doc
      .roundedRect(40, 240, 515, 180, 8)
      .lineWidth(2)
      .strokeOpacity(0.2)
      .stroke("#0d3b66");
    doc.rect(40, 240, 515, 45).fill("#f1f3f5");
    doc
      .fontSize(12)
      .fillColor("#495057")
      .font("Helvetica-Bold")
      .text("DONOR INFORMATION", 60, 255);

    const leftCol = 60;
    const rightCol = 320;
    let y = 305;

    doc
      .fontSize(10)
      .fillColor("#6c757d")
      .font("Helvetica")
      .text("Donor Name", leftCol, y);
    doc
      .fontSize(14)
      .fillColor("#212529")
      .font("Helvetica-Bold")
      .text(donation.name, leftCol, y + 18);

    doc
      .fontSize(10)
      .fillColor("#6c757d")
      .font("Helvetica")
      .text("Donation Date", rightCol, y);
    doc
      .fontSize(14)
      .fillColor("#212529")
      .font("Helvetica-Bold")
      .text(
        new Date(donation.donationDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        rightCol,
        y + 18
      );

    y += 70;
    doc
      .fontSize(10)
      .fillColor("#6c757d")
      .font("Helvetica")
      .text("Payment Method", leftCol, y);
    doc
      .fontSize(14)
      .fillColor("#212529")
      .font("Helvetica-Bold")
      .text(paymentMethod, leftCol, y + 18);

    doc
      .fontSize(10)
      .fillColor("#6c757d")
      .font("Helvetica")
      .text("Amount Donated", rightCol, y);
    doc.roundedRect(rightCol - 5, y + 12, 180, 35, 5).fill("#0d3b66");
    doc
      .fontSize(22)
      .fillColor("#faa307")
      .font("Helvetica-Bold")
      .text(`Rs. ${donation.donated_amount}`, rightCol + 10, y + 20);

    doc.roundedRect(40, 450, 515, 80, 8).fill("#e7f5ff");
    doc
      .fontSize(16)
      .fillColor("#0d3b66")
      .font("Helvetica-Bold")
      .text("Thank You for Your Generous Support!", 0, 470, {
        align: "center",
        width: 595,
      });
    doc
      .fontSize(11)
      .fillColor("#495057")
      .font("Helvetica")
      .text("Your contribution helps us serve the community better.", 0, 500, {
        align: "center",
        width: 595,
      });

    doc
      .fontSize(10)
      .fillColor("#495057")
      .font("Helvetica-Bold")
      .text("Authorized By:", 60, 570);
    doc.fontSize(11).fillColor("#212529").text("LCF Secretary", 60, 590);

    doc.image(signatureBuffer, 380, 560, { width: 140 });
    doc.moveTo(380, 670).lineTo(520, 670).lineWidth(1.5).stroke("#495057");
    doc.fontSize(9).fillColor("#6c757d").text("Authorized Signature", 410, 678);

    doc.rect(0, 740, 595, 3).fill("#faa307");
    doc.rect(0, 743, 595, 99).fill("#f8f9fa");
    doc
      .fontSize(9)
      .fillColor("#6c757d")
      .text(
        "This is a computer-generated receipt and does not require a physical signature.",
        0,
        760,
        { align: "center", width: 595 }
      );
    doc
      .fontSize(8)
      .fillColor("#adb5bd")
      .text("St. John's Church, Madathuvilai ", 0, 780, {
        align: "center",
        width: 595,
      });
    doc
      .fontSize(8)
      .text(
        "For queries, contact: stjohschurchmadathuvilai@gmail.com",
        0,
        800,
        {
          align: "center",
          width: 595,
        }
      );
    doc
      .fontSize(9)
      .fillColor("#6c757d")
      .font("Helvetica")
      .text(`Receipt ID: ${donation._id}`, 0, 820, { align: "center" });

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};
