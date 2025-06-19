import React, { useState } from "react";
import style from "./changePassword.module.css";
import { ENDPONITS } from "../../../url"; // Adjust path as needed

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    return errors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault(); // ✅ move this to top to prevent default first
  setMessage(null);
  setErrors([]);

  if (newPassword !== confirmNewPassword) {
    setErrors(["New password and confirm password do not match."]);
    return;
  }

  const validationErrors = validatePassword(newPassword);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(ENDPONITS.changePassword, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data?.message?.new_password) {
        setErrors(data.message.new_password);
      } else {
        throw new Error(data.message || "Password change failed");
      }
      return;
    }

    setMessage("✅ Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  } catch (error) {
    setMessage(error.message || "Something went wrong");
  }
};


  return (
    <div className={style.wrapper}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h2 className={style.title}>Change Password</h2>

        {message && <p className={style.message}>{message}</p>}

        {errors.length > 0 && (
          <ul className={style.errorList}>
            {errors.map((err, idx) => (
              <li key={idx} className={style.error}>
                {err}
              </li>
            ))}
          </ul>
        )}

        <label className={style.label}>Old Password</label>
        <input
          type="password"
          className={style.input}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label className={style.label}>New Password</label>
        <input
          type="password"
          className={style.input}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label className={style.label}>Confirm New Password</label>
        <input
          type="password"
          className={style.input}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />

        <button type="submit" className={style.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
