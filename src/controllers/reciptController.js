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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>ரசீது</title>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Mukta Malar', 'Inter', sans-serif;
  margin: 0;
}

@page {
  size: A4;
  margin: 0;
}

.half-page {
  height: 148.5mm;
  border-bottom: 2px dashed #999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}

.content {
  width: 210mm; /* A4 width */
  transform: scale(0.92); /* makes everything fit perfectly inside half */
  transform-origin: top center;
  display: flex;
  flex-direction: column;
  min-height: 148.5mm;
}

.header {
  background: linear-gradient(135deg, #0d3b66 0%, #1a5490 100%);
  padding: 12px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height : 130px;
  
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #faa307 0%, #f48c06 100%);
}

.logo { width: 85px; height: 85px; }
.logo2 { width: 75px; height: 75px; }

.header-text {
  color: white;
  text-align: center;
  flex: 1;
  margin: 0 15px;
}

.header-text h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 2px 0;
}

.header-text p { font-size: 11px; margin: 2px 0; opacity: 0.9; }
.header-text small { font-size: 10px; opacity: 0.85; }

.title { 
  text-align: center; 
  padding: 8px 15px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  margin: 10px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title h2 {
  font-size: 18px;
  color: #0d3b66;
  font-weight: 700;
  
}

.title .receipt-no {
  font-size: 10px;
  font-weight: 500;
font-family: 'Roboto Mono', monospace;
  color: grey;
}

.title .issued {
  font-size: 10px;
  font-weight: 500;
  color: grey;
  font-family: 'Roboto Mono', monospace;
}

.info-box {
  margin: 10px 30px;
  border: 1.5px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.info-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 8px 15px;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #faa307;
}

.info-content { padding: 12px 15px; }

.info-row { display: flex; margin-bottom: 12px; }

.info-col { flex: 1; }

.info-label {
  font-size: 10px;
  color: #868e96;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.info-label2 {
  font-size: 10px;
  color: #868e96;

  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
}

.amount-box {
  // border: 2px solid #c62828;
  border-radius: 8px;
  
  // background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
  height: 60px;
  display: flex;
  flex-direction: column;

  align-items : center;

}

.amount-value {
  font-size: 22px;
  font-weight: 700;
  color: #c62828;
}

.amount-words {
 
  font-size: 9px;
  font-weight: 500;
  color: #666;
  text-transform: uppercase;
  maargin-top: -2px;
}

.thank-box {
  margin: 0 30px 8px;
  background: linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%);
  border-radius: 8px;
  padding: 10px;
  border-left: 4px solid #0d3b66;
}

.thank-box h3 {
  font-size: 11px;
  color: #0d3b66;
  text-align: center;
  line-height: 1.4;
  font-weight: 500;
  margin: 0;
}

.ungal{
  text-align: center;
  color: #0d3b66;
  margin: 8px 0;
  font-size: 14px;
  font-weight: 700;
}

.signature-section {
  margin: 0 30px 8px;
  display: flex;
  justify-content: end;
  align-items: flex-end;
  gap:20px;
}

.sig-block {
  text-align: center;
  margin: 0;
}

.sig-img {
  width: 55px;
  margin-bottom: 4px;
}

.sig-title {
  font-size: 10px;
  font-weight: 600;
  color: #495057;
}

.footer {
  background: #f8f9fa;
  padding: 8px;
  text-align: center;
  border-top: 2px solid #faa307;
  margin-top: auto;
}

.footer p {
  font-size: 9px;
  color: #6c757d;
  margin: 2px 0;
}

.footer .receipt-id {
  font-size: 8px;
  color: #adb5bd;
  margin-top: 3px;
}

.sup-text {
  font-size: 60%;
  vertical-align: super;
}
</style>
</head>

<body>

<div class="half-page">
<div class="content">

<div class="header">
<img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771417669/SJC_app_logo-2-SJC_reciept_web_logo_5_nysuyc.png" class="logo" />
<div class="header-text">
<p>தூத்துக்குடி – நாசரேத் திருமண்டலம், மடத்துவிளை சேகரம்</p>
<h1>தூய யோவான் ஆலயம்</h1>
<h1>பரிபாலன கமிட்டி</h1>
<small>stjohnschurchmadadthuvilai@gmail.com | +91 9865384841</small>
</div>
<img src="https://res.cloudinary.com/dusji1fg2/image/upload/v1771409834/CSI_Logo.1b40b3e0_1_bjpldd.png" class="logo2"/>
</div>

<div class="title">
<div class="receipt-no">ரசீது எண்: ${donation.receiptNumber}</div>
<h2>132<span class="sup-text">வது</span> அசன பண்டிகை 2026</h2>
<div class="issued">வழங்கப்பட்ட தேதி: ${new Date().toLocaleDateString(
      "en-IN"
    )}</div>
</div>

<div class="info-box">
<div class="info-header">நன்கொடையாளர் தகவல்</div>
<div class="info-content">

<div class="info-row">
<div class="info-col">
<div class="info-label">பெயர்</div>
<div class="info-value">${donation.name}</div>
</div>
<div class="info-col">
<div class="info-label">நன்கொடை தேதி</div>
<div class="info-value">${new Date(donation.donationDate).toLocaleDateString(
      "en-IN"
    )}</div>
</div>
<div class="info-col">
<div class="info-label">செலுத்தும் முறை</div>
<div class="info-value">${paymentMethod}</div>

</div>

<div class="amount-box">
  <div class="info-label2">செலுத்தும் முறை</div>
    <div class="amount-value">₹ ${donation.donated_amount}</div>
      <div class="amount-words">ரூபாய் ${numberToWords(
        donation.donated_amount
      )}  மட்டும்</div>
</div>
</div>



</div>
</div>

<div class="thank-box">
<h3>நீங்கள் இப்பொழுது இருக்கிறதைப் பார்க்கிலும் ஆயிரமடங்கு அதிகமாகும்படி கர்த்தர் உங்களை ஆசீர்வதிப்பாராக. ~ உபா 1:11</h3>
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

<div class="footer">
<p>இது கணினி மூலம் உருவாக்கப்பட்ட ரசீது;</p>
<p>தூய யோவான் ஆலயம் பரிபாலன கமிட்டி, மடத்துவிளை</p>
<div class="receipt-id">ID: ${donation._id}</div>
</div>

</div>
</div>

<script>
window.addEventListener("load", function() {
  setTimeout(() => {
    window.print();
  }, 400);
});
</script>

</body>
</html>
`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
