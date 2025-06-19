import React, { useState } from "react";
import styles from "./userModal.module.css";
import { FaTimes, FaTrashAlt, FaCheck } from "react-icons/fa";
import { useUserData } from "../../Store/UseContexts/UseContexts";

const UserModal = ({ user, mode, onClose }) => {
  const { deleteUser, updateUser } = useUserData();
  const [formData, setFormData] = useState({ ...user, is_active: true });
  const [showDeleteConfirm] = useState(mode === "delete");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleUpdate = () => {
    updateUser(formData)
    onClose();
  };

  const confirmDelete = () => {
    onClose();
    deleteUser(user);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {showDeleteConfirm ? (
          <div className={styles.confirmBox}>
            <h3>{user.full_name}</h3>
            <p><strong>Date Joined:</strong> {user.date_joined}</p>
            <p>Are you sure you want to delete this user?</p>
            <div className={styles.confirmButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}> Delete</button>
              <button onClick={onClose} className={styles.cancelButton}> Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>{mode === "view" ? "User Details" : "Edit User"}</h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroupContainer}>
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <label>First Name:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Full Name:</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  {/* <div className={styles.formRow}>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} readOnly={mode === "view"} />
                  </div> */}
                  <div className={styles.formRow}>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                </div>

                <div className={styles.formColumn}>
                  {/* <div className={styles.formRow}>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} readOnly={mode === "view"} />
                  </div> */}
                  <div className={styles.formRow}>
                    <label>Joined Date:</label>
                    <input type="date" name="role" value={formData.date_joined} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Status:</label>
                    <select name="is_active" value={formData.is_active ? "true" : "false"} onChange={handleChange} disabled={mode === "view"}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <label>Date Joined:</label>
                    <input type="date" name="date_joined" value={formData.date_joined} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.submitContainer}>
              <button onClick={onClose} className={styles.submitButton}> Close</button>
              {mode === "edit" && <button onClick={handleUpdate} className={styles.submitButton}> Update</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
