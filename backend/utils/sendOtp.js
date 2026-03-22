import nodemailer from "nodemailer";

const sendOtpMail = async (email, otp) => {
  try {
    console.log("📧 Preparing to send OTP mail...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL (IMPORTANT)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
      connectionTimeout: 20000, // ⏳ avoid timeout (Render slow hota hai)
    });

    // 🔍 DEBUG (optional but helpful)
    await transporter.verify()
      .then(() => console.log("✅ SMTP Connected"))
      .catch((err) => console.log("❌ SMTP ERROR:", err));

    const mailOptions = {
      from: `"Pro Ultimate Gym 💪" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2 style="color:#e53935;">Pro Ultimate Gym</h2>
          <p>Your OTP for login:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Mail sent:", info.response);

  } catch (error) {
    console.log("❌ Error sending OTP:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default sendOtpMail;