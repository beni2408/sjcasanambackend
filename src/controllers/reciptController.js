import donationModel from "../models/donationModel.js";

const numberToWords = (amount) => {
  if (!amount) return "Zero Rupees";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    if (num < 1000)
      return ones[Math.floor(num / 100)] + " Hundred " + numToWords(num % 100);
    if (num < 100000)
      return (
        numToWords(Math.floor(num / 1000)) +
        " Thousand " +
        numToWords(num % 1000)
      );
    if (num < 10000000)
      return (
        numToWords(Math.floor(num / 100000)) +
        " Lakh " +
        numToWords(num % 100000)
      );

    return (
      numToWords(Math.floor(num / 10000000)) +
      " Crore " +
      numToWords(num % 10000000)
    );
  };

  const [rupees, paise] = amount.toString().split(".");

  let words = `${numToWords(parseInt(rupees))} `;

  if (paise) words += ` and ${numToWords(parseInt(paise))} Paise`;

  return words.trim();
};

export const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).send("Receipt not found");
    }

    const paymentMethod =
      donation.paymentMode.toLowerCase() === "hand"
        ? "CASH"
        : donation.paymentMode.toUpperCase();

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Helvetica, Arial, sans-serif; width: 595px; height: 842px; margin: 0 auto; display: flex; flex-direction: column; }
            .content { flex: 1; }
            .header { background: #0d3b66; height: 140px; display: flex; align-items: center; padding: 0 40px; }
            .logo { width: 90px; height: 90px; margin-right: 20px; }
            .header-text { color: white; }
            .header-text h1 { font-size: 36px; font-weight: bold; margin-bottom: 5px; }
            .header-text p { font-size: 15px; margin: 3px 0; }
            .header-text small { font-size: 12px; }
            .divider { height: 3px; background: #faa307; }
            .title { text-align: center; padding-top: 20px; }
            .title h2 { font-size: 28px; color: #0d3b66; font-weight: bold; margin-bottom: 10px; }
            .title .receipt-no { font-size: 18px; color: #212529; font-weight: bold; margin-bottom: 5px; }
            .title .issued { font-size: 12px; color: #666; }
            .info-box { margin: 25px 40px; border: 2px solid rgba(13, 59, 102, 0.2); border-radius: 8px; overflow: hidden; }
            .info-header { background: #f1f3f5; padding: 12px 20px; font-size: 14px; color: #495057; font-weight: bold; }
            .info-content { padding: 25px 20px; }
            .info-row { display: flex; margin-bottom: 28px; }
            .info-col { flex: 1; }
            .info-label { font-size: 12px; color: #6c757d; margin-bottom: 8px; }
            .info-value { font-size: 18px; color: #212529; font-weight: bold; }
           .amount-box {
  border: 1.5px solid #c62828;
  border-radius: 8px;
  padding: 10px 16px;
  background: #fff;
}

.amount-value {
  font-size: 22px;
  font-weight: 800;
  color: #c62828;
}

.amount-words {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 900;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

            .thank-box { margin: 0 40px 25px; background: #e7f5ff; border-radius: 8px; padding: 22px; text-align: center; }
            .thank-box h3 { font-size: 20px; color: #0d3b66; font-weight: bold; margin-bottom: 8px; }
            .thank-box p { font-size: 13px; color: #495057; }
            .signature-section { margin: 0 40px 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-left p { font-size: 12px; color: #495057; font-weight: bold; margin-bottom: 5px; }
            .sig-left h4 { font-size: 13px; color: #212529; }
            .sig-right { text-align: center; }
            .sig-img { width: 140px; height: auto; margin-bottom: 10px; }
            .sig-line { width: 140px; height: 1.5px; background: #495057; margin: 10px 0; }
            .sig-text { font-size: 11px; color: #6c757d; }
            .footer-divider { height: 3px; background: #faa307; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; }
            .footer p { font-size: 11px; color: #6c757d; margin: 5px 0; }
            .footer small { font-size: 10px; color: #adb5bd; display: block; margin: 3px 0; }
            @media print { body { margin: 0; } @page { margin: 0; size: A4; } html, body { width: 210mm; height: 297mm; } }
          </style>
        </head>
        <body onload="window.print()">
          <div class="content">
          <div class="header">
            <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771231215/SJC_app_logo-2-SJC_reciept_web_logo_2_ww8vbk.png" class="logo" />
            <div class="header-text">
              <h1>ST. JOHN'S CHURCH</h1>
              <p>Madathuvilai, Arumuganeri, Thoothukudi - Nazareth Diocese</p>
              <small>stjohnschurchmadadthuvilai@gmail.com | +91 9865384841</small>
            </div>
          </div>
          <div class="divider"></div>
          <div class="title">
      
          
          <h2> 132 nd ASANAM FESTIVAL 2026</h2>
    
            <div class="receipt-no">Receipt No: ${donation.receiptNumber}</div>
            <div class="issued">Issued on: ${new Date().toLocaleDateString(
              "en-IN",
              { day: "2-digit", month: "long", year: "numeric" }
            )}</div>
          </div>
          <div class="info-box">
            <div class="info-header">DONOR INFORMATION</div>
            <div class="info-content">
              <div class="info-row">
                <div class="info-col">
                  <div class="info-label">Donor Name</div>
                  <div class="info-value">${donation.name}</div>
                </div>
                <div class="info-col">
                  <div class="info-label">Donation Date</div>
                  <div class="info-value">${new Date(
                    donation.donationDate
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}</div>
                </div>
              </div>
              <div class="info-row" style="margin-bottom: 0;">
                <div class="info-col">
                  <div class="info-label">Payment Method</div>
                  <div class="info-value">${paymentMethod}</div>
                </div>
              <div class="info-col">
  <div class="info-label">Amount Donated</div>
 <div class="amount-box">
  <div class="amount-value">
    Rs. ${donation.donated_amount}
  </div>

  <div class="amount-words">

  [Rupees  ${numberToWords(donation.donated_amount)} Only]
  </div>
</div>

</div>
                
              </div>
            </div>
          </div>
          <div class="thank-box">
            <h3>Thank You for Your Generous Support!</h3>
            <p>Your contribution helps us serve the community better.</p>
          </div>
          <div class="signature-section">
            <div class="sig-left">
              <p>Authorized By:</p>
              <h4>LCF Secretary</h4>
            </div>
            <div class="sig-right">
              <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771228173/IMG_8382_2_raytz3.jpg" class="sig-img" />
              <div class="sig-line"></div>
              <div class="sig-text">Authorized Signature</div>
            </div>
          </div>
          </div>
          <div class="footer-divider"></div>
          <div class="footer">
            <p>This is a computer-generated receipt and does not require a physical signature.</p>
            <small>St. John's Church, Madathuvilai</small>
            <small>For queries, contact: stjohschurchmadathuvilai@gmail.com</small>
            <small style="margin-top: 10px;">Receipt ID: ${donation._id}</small>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
