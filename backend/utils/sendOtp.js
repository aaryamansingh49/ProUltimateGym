import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpMail = async (email, otp) => {
  try {
    console.log("📧 Sending OTP via Resend...");

    const response = await resend.emails.send({
      from: "Pro Ultimate Gym <onboarding@resend.dev>", 
      to: email,
      subject: "Your Login OTP",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2 style="color:#e53935;">Pro Ultimate Gym </h2>
          <p>Your OTP for login:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP sent:", response);

  } catch (error) {
    console.log("❌ Resend Error:", error?.response?.data || error.message);
    throw new Error("Failed to send OTP email");
  }
};

export default sendOtpMail;