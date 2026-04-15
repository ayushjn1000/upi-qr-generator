import React, { useState } from "react";
import QRCode from "qrcode";
import { QRCode as QRUI } from "react-qrcode-logo";
import "./App.css";

const App = () => {
  const [amount, setAmount] = useState("");

  const name = "Paras Cloth House";
  const note = "Payment";
  const upiId = "Q526822327@ybl";

  const splitAmount = (amount) => {
    const max = 2000;
    let remaining = Number(amount);
    let parts = [];

    while (remaining > 0) {
      if (remaining > max) {
        parts.push(max);
        remaining -= max;
      } else {
        parts.push(remaining);
        remaining = 0;
      }
    }
    return parts;
  };

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;

  // 🔥 DOWNLOAD WITH LOGOS
  const downloadSplitQRs = async () => {
    const parts = amount > 2000 ? splitAmount(amount) : [amount];

    for (let i = 0; i < parts.length; i++) {
      const amt = parts[i];

      const upi = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
        name
      )}&am=${amt}&tn=${encodeURIComponent(note)}&cu=INR`;

      const qrDataUrl = await QRCode.toDataURL(upi);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 400;
      canvas.height = 650;

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 400, 650);

      // Load QR
      const qrImg = new Image();
      qrImg.src = qrDataUrl;

      await new Promise((res) => (qrImg.onload = res));

      // Load logos
      const paytm = new Image();
      paytm.src = "/paytm.png";

      const gpay = new Image();
      gpay.src = "/gpay.png";

      const phonepe = new Image();
      phonepe.src = "/phonepe.png";

      const bhim = new Image();
      bhim.src = "/bhim.png";

      await Promise.all([
        new Promise((res) => (paytm.onload = res)),
        new Promise((res) => (gpay.onload = res)),
        new Promise((res) => (phonepe.onload = res)),
        new Promise((res) => (bhim.onload = res)),
      ]);

      // Title
      ctx.fillStyle = "#000";
      ctx.font = "bold 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Paras Cloth House", 200, 60);

      ctx.font = "16px Arial";
      ctx.fillText("Scan & Pay", 200, 90);

      // QR
      ctx.drawImage(qrImg, 90, 130, 220, 220);

      // Amount
      ctx.font = "bold 26px Arial";
      ctx.fillText(`₹ ${amt}`, 200, 380);

      // Logos row
      ctx.drawImage(phonepe, 60, 420, 40, 40);
      ctx.drawImage(gpay, 130, 420, 40, 40);
      ctx.drawImage(paytm, 200, 420, 40, 40);
      ctx.drawImage(bhim, 270, 420, 40, 40);

      // Footer
      ctx.font = "12px Arial";
      ctx.fillStyle = "#444";
      ctx.fillText("Send payment to Paras Cloth House", 200, 500);
      ctx.fillText("Share screenshot after payment", 200, 520);

      // ❤️ Special text
      ctx.fillStyle = "#e91e63";
      ctx.fillText(
        "Designed with ❤️ for Paras Uniforms",
        200,
        560
      );

      // Download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `upi-card-${i + 1}.png`;
      link.click();
    }
  };

  const shareOnWhatsApp = () => {
    const parts = splitAmount(amount);

    const message = parts
      .map(
        (amt, i) =>
          `Payment ${i + 1}: upi://pay?pa=${upiId}&pn=${encodeURIComponent(
            name
          )}&am=${amt}&cu=INR`
      )
      .join("%0A");

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="app">
      <div className="marquee">
        ✨ Dynamic QR APP for Paras Uniforms ✨
      </div>

      <div className="card">
        <h2>Scan & Pay</h2>

        {amount && (
          <>
            <QRUI value={upiUrl} size={220} qrStyle="squares" />
            <p className="amount">₹ {amount}</p>
          </>
        )}

        <h3>{name}</h3>
        <p>UPI ID: {upiId}</p>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* 🔥 LOGOS ON UI */}
        <div className="apps">
          <img src="/phonepe.png" alt="" />
          <img src="/gpay.png" alt="" />
          <img src="/paytm.png" alt="" />
          <img src="/bhim.png" alt="" />
        </div>

        <div className="footer">Scan using any UPI app</div>

        {amount > 2000 && (
          <div className="actions">
            <button onClick={downloadSplitQRs} style={{marginBottom:10}}>
              Download Split QR
            </button>
            <button onClick={shareOnWhatsApp}>
              Send to WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;