import { Resend } from "resend";

const sendOtpMail = async (email, otp) => {
  try {
    console.log("API KEY:", process.env.RESEND_API_KEY);
    console.log("SENDING OTP TO:", email);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "Pro Ultimate Gym <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2 style="color:#e53935;">Pro Ultimate Gym</h2>
          <p>Your OTP:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));

    return true; // ✅ IMPORTANT

  } catch (error) {
    console.log("Resend Error:", error?.response?.data || error.message);
    return false;
  }
};

export default sendOtpMail;