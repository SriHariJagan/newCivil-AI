import React, { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { ENDPONITS } from "../../../url";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(ENDPONITS.adminProfile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.status) {
          setProfile(data.results);
          setFormData({
            first_name: data.results.first_name || "",
            last_name: data.results.last_name || "",
            phone: data.results.phone || "",
            username: data.results.username || "",
            email: data.results.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    const newErrors = {};

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be a 10-digit number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(ENDPONITS.adminProfile, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          username: formData.username,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.status) {
        setProfile(data.results);
        setEditMode(false);
        setErrors({});
      } else {
        console.error("Update failed", data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading profile...</div>;
  }

  if (!profile) {
    return <div className={styles.container}>Failed to load profile.</div>;
  }

  const { email } = profile;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {editMode ? (
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            encType="multipart/form-data"
          >
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
            </label>

            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </label>

            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                value={email}
                disabled
                className={styles.adminEmail}
              />
            </label>

            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setFormData((prev) => ({ ...prev, phone: onlyNums }));
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Phone"
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone}</span>
              )}
            </label>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveBtn}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setErrors({});
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className={styles.name}>
              {`${formData.first_name} ${formData.last_name}`.trim() ||
                "Not Provided"}
            </h2>

            <div className={styles.infoBlock}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Username:</span>
                <span className={styles.value}>
                  {formData.username || "Not Provided"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {formData.phone || "Not Provided"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              className={styles.editBtn}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
