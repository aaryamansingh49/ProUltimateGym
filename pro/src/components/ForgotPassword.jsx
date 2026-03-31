import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../api/config";
import "../styles/otpLogin.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [notification, setNotification] = useState(null);

  const inputsRef = useRef([]);

  // ================= NOTIFICATION =================
  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!email) {
      showNotification("error", "Enter email first");
      return;
    }

    try {
      setSendingOtp(true);

      // console.log("SEND OTP BUTTON CLICKED"); // DEBUG
      // console.log("EMAIL VALUE:", email); // DEBUG

      await axios.post(`${BASE_URL}/api/send-reset-otp`, { email });

      setOtpSent(true);
      setTimer(30);
      setStep(2);

      showNotification("success", "OTP sent to your email");
    } catch (err) {
      console.log("OTP ERROR:", err);
      showNotification("error", "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async (finalOtp) => {
    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/verify-reset-otp`, {
        email,
        otp: finalOtp,
      });

      showNotification("success", "OTP Verified");
      setStep(3);
    } catch (err) {
      showNotification("error", "Invalid OTP");

      setOtp(new Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/reset-password`, {
        email,
        password,
      });

      showNotification("success", "Password reset successful");

      setTimeout(() => {
        window.location = "/login";
      }, 1000);
    } catch (err) {
      showNotification("error", "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= OTP INPUT =================
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }

    const joined = newOtp.join("");

    if (joined.length === 6) {
      verifyOtp(joined);
    }
  };

  // ================= PASTE =================
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();

    if (paste.length === 6) {
      const pasteArray = paste.split("");
      setOtp(pasteArray);
      verifyOtp(paste);
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const resendOtp = () => {
    if (timer === 0) {
      sendOtp();
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        {notification && (
          <div className={`otp-notification otp-${notification.type}`}>
            {notification.message}
          </div>
        )}

        <h2 className="otp-title">Reset Your Password</h2>
        {/* <p className="otp-subtext">Enter your email to receive OTP</p> */}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="otp-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="otp-btn"
              onClick={() => {
                console.log("BUTTON CLICKED");
                sendOtp();
              }}
              disabled={sendingOtp}
            >
              {sendingOtp ? <div className="spinner"></div> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 OTP */}
        {step === 2 && (
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

        {/* STEP 3 PASSWORD */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter your new password"
              className="otp-email"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="otp-btn" onClick={resetPassword}>
              {loading ? <div className="spinner"></div> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;