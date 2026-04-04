import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../api/config";
import "../styles/otpLogin.css";

const OtpLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [notification, setNotification] = useState(null);

  const inputsRef = useRef([]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const sendOtp = async () => {
    try {
      setSendingOtp(true);
      await axios.post(`${BASE_URL}/api/send-otp`, { email });
      setOtpSent(true);
      setTimer(30);
      showNotification("success", "OTP sent to your email");
    } catch (err) {
      showNotification("error", "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async (finalOtp) => {
    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/verify-otp`, {
        email,
        otp: finalOtp,
      });

      showNotification("success", "Login Successful");

      setTimeout(async () => {
        const token = res.data.token;
        const user = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("userKey", user._id);
        localStorage.setItem("isNewUser", res.data.isNewUser);

        let userProfile = user;

        try {
          const profileRes = await axios.get(`${BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          userProfile = { ...user, ...profileRes.data.profile };
        } catch (err) {}

        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        localStorage.setItem("userEmail", user.email);

        window.location = "/dashboard";
      }, 800);
    } catch (err) {
      showNotification("error", "Invalid OTP");
      setOtp(new Array(6).fill(""));
      inputsRef.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) element.nextSibling.focus();

    const joined = newOtp.join("");
    if (joined.length === 6) verifyOtp(joined);
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (paste.length === 6) {
      const pasteArray = paste.split("");
      setOtp(pasteArray);
      verifyOtp(paste);
    }
  };

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const resendOtp = () => {
    if (timer === 0) sendOtp();
  };

  return (
    <div className="otp-page">
      <div className="otp-card">

        {notification && (
          <div className={`otp-notification otp-${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* <h2 className="brand"><span>Pro Ultimate Gym</span></h2> */}
        <h1>Login via OTP</h1>
        <p className="subtitle">Secure login using one-time password</p>

        {!otpSent && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="otp-email"
            />

            <button className="otp-btn" onClick={sendOtp} disabled={sendingOtp}>
              {sendingOtp ? <div className="spinner"></div> : "Send OTP"}
            </button>
          </>
        )}

        {otpSent && (
          <>
            <p className="otp-text">Enter 6 digit OTP</p>

            <div className="otp-input-group" onPaste={handlePaste}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  className="otp-input"
                />
              ))}
            </div>

            <button
              className="otp-btn"
              onClick={() => verifyOtp(otp.join(""))}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Verify OTP"}
            </button>

            <p className="resend-text">
              {timer > 0 ? (
                <>Resend OTP in {timer}s</>
              ) : (
                <span onClick={resendOtp} className="resend-btn">
                  Resend OTP
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;