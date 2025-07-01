import React, { useState } from "react";
import styles from "./loginpage.module.css";
import { useAuthData } from "../../Store/UseContexts/UseContexts";
import { useNavigate } from "react-router-dom";

import { ENDPONITS } from "../../../url";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // New states for forgot password flow
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: enter email, 2: enter token+new password
  const [message, setMessage] = useState("");

  const { authenticate } = useAuthData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticate(email, password, navigate);
    setEmail("");
    setPassword("");
  };

  // Handle sending reset token
  const handleSendToken = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendResetToken(resetEmail);
      setMessage("Reset token sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage("Error sending reset token. Please try again.", err);
    }
  };

  // Handle resetting password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await resetPassword(resetEmail, token, newPassword);
      setMessage("Password reset successful. You can now login.");
      // Reset form and exit forgot password mode
      setForgotPasswordMode(false);
      setStep(1);
      setResetEmail("");
      setToken("");
      setNewPassword("");
    } catch (err) {
      setMessage("Invalid token or error resetting password.",err);
    }
  };

  async function sendResetToken(email) {
    // API call to send reset token to user email
    const response = await fetch(ENDPONITS.forgetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to send token");
  }

 async function resetPassword(email, token, newPassword) {

    if(newPassword != confirmNewPassword){
      setMessage("New password and confirm password do not match.");
      return
    }

    // API call to verify token and reset password
    const response = await fetch(ENDPONITS.resetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    });
    if (!response.ok) throw new Error("Failed to reset password");
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {!forgotPasswordMode && (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputSection1}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputSection1}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>

            <a
              href="#"
              className={styles.forgotPassword1}
              onClick={(e) => {
                e.preventDefault();
                setForgotPasswordMode(true);
              }}
            >
              Forgot Password?
            </a>
          </form>
        )}

        {forgotPasswordMode && step === 1 && (
          <form onSubmit={handleSendToken}>
            <h3 className={styles.forgetheading}>Forgot Password</h3>
            <div className={styles.inputSection}>
              <span>Enter your email to receive reset token</span>
              <input
                type="email"
                placeholder="Email"
                className={styles.inputField}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Send Reset Token
            </button>
            <button
              className={styles.forgotPassword}
              onClick={() => {
                setForgotPasswordMode(false);
                setMessage("");
              }}
            >
              Back to Login
            </button>
            {message && <p>{message}</p>}
          </form>
        )}

        {forgotPasswordMode && step === 2 && (
          <form onSubmit={handleResetPassword}>
            <h3>Reset Password</h3>
            <div className={styles.inputSection1}>
              <label>Reset Token</label>
              <input
                type="text"
                placeholder="Enter token"
                className={styles.inputField}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputSection1}>
              <label>New Password</label>
              <input
                type="password"
                placeholder="New password"
                className={styles.inputField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputSection1}>
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="New password"
                className={styles.inputField}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Reset Password
            </button>
            <button
              className={styles.forgotPassword}
              onClick={() => {
                setStep(1);
                setMessage("");
              }}
            >
              Back
            </button>
            {message && <p>{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
