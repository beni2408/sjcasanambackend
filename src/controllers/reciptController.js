import donationModel from "../models/donationModel.js";

export const generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await donationModel.findById(id);

    if (!donation) {
      return res.status(404).send("Receipt not found");
    }

    res.send(`
      <html>
        <head>
          <title>Donation Receipt</title>

          <style>
            body {
              font-family: monospace;
              text-align: center;
              padding: 10px;
            }

            .receipt {
              width: 80mm;
              margin: auto;
              font-size: 12px;
            }

            hr {
              border: 1px dashed black;
            }

            .row {
              text-align: left;
              margin: 5px 0;
            }

            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>

        <body onload="window.print()">

          <div class="receipt">

            <h3>St. John's Church</h3>
            <p>Donation Receipt</p>

            <hr/>

            <div class="row">Name: ${donation.name}</div>
            <div class="row">Address: ${donation.address}</div>
            <div class="row">Amount: ₹${donation.donated_amount}</div>
            <div class="row">Mode: ${donation.paymentMode}</div>
            ${
              donation.transactionId
                ? `<div class="row">Txn ID: ${donation.transactionId}</div>`
                : ""
            }
            <div class="row">Date: ${new Date(
              donation.donationDate
            ).toLocaleDateString()}</div>

            <hr/>

            <p>Thank You 🙏</p>

          </div>

        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
