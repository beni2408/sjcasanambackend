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
    <meta charset="UTF-8">

    <!-- ✅ PROFESSIONAL FONT -->
    <link href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@400;500;600;700&display=swap" rel="stylesheet">

    <title>ரசீது</title>

    <style>
* { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        font-family: 'Mukta Malar', sans-serif;
        width: 595px;
        height: 842px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }

      .content { flex: 1; }

      .header {
        background: #0d3b66;
        height: 170px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
      }

      .logo { width: 100px; height: 100px; }
      .logo2 { width: 70px; height: 70px;  }

      .header-text {
        color: white;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .header-text h1 {
        font-size: 30px;
        font-weight: bold;
        
      }

      .header-text p { font-size: 15px; margin: 1px 0; }
      .header-text small { font-size: 12px; }

      .divider { height: 3px; background: #faa307; }

      .title { text-align: center; padding-top: 5px; }

      .title h2 {
        font-size: 28px;
        color: #0d3b66;
        font-weight: bold;
        margin-bottom: 10px;
        
      }

      .title .receipt-no {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 5px;
        font-family: 'Courier New', Courier, monospace;
      }

      .title .issued {
        font-size: 12px;
        color: #666;
        font-family: 'Courier New', Courier, monospace;
      }

      .info-box {
        margin: 25px 40px;
        border: 2px solid rgba(13, 59, 102, 0.2);
        border-radius: 8px;
        overflow: hidden;
      }

      .info-header {
        background: #f1f3f5;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
      }

      .info-content { padding: 25px 20px; }

      .info-row { display: flex; margin-bottom: 28px; }

      .info-col { flex: 1; }

      .info-label {
        font-size: 12px;
        color: #6c757d;
        margin-bottom: 8px;
      }

      .info-value {
        font-size: 18px;
        font-weight: 600;
      }

      .amount-box {
        border: 1.5px solid #c62828;
        border-radius: 8px;
        padding: 10px 16px;
        background: #fff;
      }

      .amount-value {
        font-size: 22px;
        font-weight: 700;
        color: #c62828;
      }

      .amount-words {
        margin-top: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #777;
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }

      .thank-box {
        margin: 0 40px 25px;
        background: #e7f5ff;
        border-radius: 8px;
        padding: 22px;
        
      }

      .thank-box h3 {
        font-size: 20px;
        color: #0d3b66;
        margin-bottom: 6px;
        text-align: center;
      }

      .thank-box p {
        font-size: 13px;
        color: #495057;
        text-align: end;
      }

      .signature-section {
        margin: 0 40px 25px;
        display: flex;
        justify-content: end;
        align-items: flex-end;
      }

      .sig-block {
        width: 120px;
        text-align: center;
      }

      .sig-img {
        width: 70px;
        margin-bottom: 6px;
      }

      .sig-line {
        width: 110px;
        height: 1.5px;
        background: #495057;
        margin: 6px auto;
      }

      .sig-label {
        font-size: 11px;
        color: #6c757d;
      }

      .sig-title {
        font-size: 13px;
        font-weight: 600;
      }

      .footer-divider { height: 3px; background: #faa307; }

      .footer {
        background: #f8f9fa;
        padding: 20px;
        text-align: center;
      }

      .footer p {
        font-size: 11px;
        color: #6c757d;
        margin: 5px 0;
      }

      .footer small {
        font-size: 10px;
        color: #adb5bd;
        display: block;
        margin: 3px 0;
      }

      .sup-text {
        font-size: 55%;
        vertical-align: super;
        font-weight: 600;
      }
        .ungal{
        text-align: center;
        justify-content: center;
        align-items: center;
        color: #0d3b66;
        margin-bottom: 20px;
        }

      @media print {
        body { margin: 0; }
        @page { margin: 0; size: A4; }
        html, body { width: 210mm; height: 297mm; }
      }
    </style>
  </head>

  <body onload="window.print()">
    <div class="content">

      <div class="header">
        <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771417669/SJC_app_logo-2-SJC_reciept_web_logo_5_nysuyc.png" class="logo" />

        <div class="header-text">
        <p>தூத்துக்குடி – நாசரேத் திருமண்டலம், மடத்துவிளை சேகரம்</p>
          <h1>தூய யோவான் ஆலயம் </h1>
          <h1>பரிபாலன கமிட்டி</h1>
          <small>stjohnschurchmadadthuvilai@gmail.com | +91 9865384841</small>
        </div>

        <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771409834/CSI_Logo.1b40b3e0_1_bjpldd.png" class="logo2"/>
      </div>

      <div class="divider"></div>

      <div class="title">
        <h2>
          132<span class="sup-text">வது</span>அசன பண்டிகை 2026
        </h2>

        <div class="receipt-no">ரசீது எண்: ${donation.receiptNumber}</div>

        <div class="issued">
          வழங்கப்பட்ட தேதி:
          ${new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div class="info-box">
        <div class="info-header">நன்கொடையாளர் தகவல்</div>

        <div class="info-content">

          <div class="info-row">
            <div class="info-col">
              <div class="info-label">நன்கொடையாளரின் பெயர்</div>
              <div class="info-value">${donation.name}</div>
            </div>

            <div class="info-col">
              <div class="info-label">தேதி</div>
              <div class="info-value">
                ${new Date(donation.donationDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div class="info-row" style="margin-bottom: 0;">
            <div class="info-col">
              <div class="info-label">பணம் செலுத்தும் முறை</div>
              <div class="info-value">${paymentMethod}</div>
            </div>

            <div class="info-col">
              <div class="info-label">தொகை</div>

              <div class="amount-box">
                <div class="amount-value">
                  ₹ ${donation.donated_amount}
                </div>

                <div class="amount-words">
                  [ரூபாய் ${numberToWords(donation.donated_amount)} மட்டும்]
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="thank-box">
      <h3>நீங்கள் இப்பொழுது இருக்கிறதைப் பார்க்கிலும் ஆயிரமடங்கு அதிகமாகும்படி கர்த்தர் உங்களை ஆசீர்வதிப்பாராக. </br>~ உபா 1:11</h3>
      <p></p>
      
      </div>
                  <h3 class="ungal">உங்கள் அன்பான ஆதரவிற்கு நன்றி!</h3>
      <div class="signature-section">

        <div class="sig-block">
          <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771302430/SJC_app_logo-4-GRP_Sign_za89hs.png" class="sig-img" />
 

          <div class="sig-title">LCF செயலாளர்</div>
        </div>

        <div class="sig-block">
          <img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771302430/SJC_app_logo-3-Ishiah_Signature_qaoomm.png" class="sig-img" />

          <div class="sig-title">LCF பொருளாளர்</div>
        </div>

      </div>

    </div>

    <div class="footer-divider"></div>

    <div class="footer">
      <p>இது கணினி மூலம் உருவாக்கப்பட்ட ரசீது; கைச்சாத்து தேவையில்லை.</p>
      <small>தூய யோவான் ஆலயம் பரிபாலன கமிட்டி, மடத்துவிளை</small>
      <small>வினவல்கள்: stjohnschurchmadadthuvilai@gmail.com</small>
      <small style="margin-top: 10px;">ரசீது ஐடி: ${donation._id}</small>
    </div>

  </body>
</html>


    `);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
