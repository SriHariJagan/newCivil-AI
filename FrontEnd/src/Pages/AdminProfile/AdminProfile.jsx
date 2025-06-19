import React, { useEffect, useState } from "react";
import styles from "./admin.module.css";
import { ENDPONITS } from "../../../url";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    username: "",
    email: "",
  });
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [previewImage, setPreviewImage] = useState("");

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
          // setPreviewImage(data.results.image || "");
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
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };

 const handleSubmit = async (e) => {
  e.preventDefault();

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
        {/* <img
          src={previewImage || "https://via.placeholder.com/100x100?text=Admin"}
          alt="Admin"
          className={styles.avatar}
        /> */}

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
              <input type="email" value={email} disabled />
            </label>

            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </label>

            {/* <label>
              Profile Photo:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label> */}

            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h2 className={styles.name}>
              {`${formData.first_name} ${formData.last_name}`.trim() ||
                "Not Provided"}
            </h2>
            <p className={styles.email}>
              <strong>Email:</strong> {email}
            </p>
            <p className={styles.username}>
              <strong>Username:</strong> {formData.username || "Not Provided"}
            </p>
            <p className={styles.phone}>
              <strong>Phone:</strong> {formData.phone || "Not Provided"}
            </p>
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



export default AdminProfile