import React, { useState } from "react";
import styles from "./newUserForm.module.css";
import { useUserData } from "../../Store/UseContexts/UseContexts";

const NewUserForm = ({ setShowNewUserForm }) => {
  const { createNewUser } = useUserData();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    date_joined: new Date().toISOString().split("T")[0],
    is_active: true,
    notification: true,
  });

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validate phone
    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Phone number must be exactly 10 digits.");
      } else {
        setPhoneError("");
      }
    }

    // Validate email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email address.");
      } else {
        setEmailError("");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "is_active" ? value === "true" : value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (phoneError || emailError) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    setShowNewUserForm(false);
    createNewUser(formData);
  };

  return (
    <div className={styles.formContainer}>
      <button className={styles.closeFormBtn} onClick={() => setShowNewUserForm(false)}>X</button>
      <h2 className={styles.formTitle}>Create New User</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
          {emailError && <p className={styles.errorText}>{emailError}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            required
          />
          {phoneError && <p className={styles.errorText}>{phoneError}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Date Joined</label>
          <input
            type="date"
            name="date_joined"
            value={formData.date_joined}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            name="is_active"
            value={formData.is_active ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="notification"
              checked={formData.notification}
              onChange={handleChange}
            />
            Receive Notifications
          </label>
        </div>

        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>Create User</button>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
