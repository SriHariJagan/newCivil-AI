import React, { useState, useEffect } from "react";
import styles from "./logModal.module.css";

const LogModal = ({ log, mode, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    subject: "",
    receivedFrom: "",
    sentTo: "",
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    if (log) setForm(log);
  }, [log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.subject || !form.receivedFrom || !form.sentTo) return;
    onSave({ ...form, id: log?.id || Date.now() });
  };

  const confirmDelete = () => {
    onDelete(log.id);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {mode === "delete" ? (
          <div className={styles.confirmBox}>
            <h3>{log.subject}</h3>
            <p><strong>Received From:</strong> {log.receivedFrom}</p>
            <p><strong>Sent To:</strong> {log.sentTo}</p>
            <div className={styles.confirmButtons}>
              <button onClick={confirmDelete} className={styles.cancelButton}>Delete</button>
              <button onClick={onClose} className={styles.submitButton}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>
              {mode === "edit" ? "Edit Log" : mode === "view" ? "Log Details" : "Create Log"}
            </h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Subject:</label>
                {mode === "view" ? (
                  <p className={styles.readOnlyText}>{form.subject}</p>
                ) : (
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Received From:</label>
                {mode === "view" ? (
                  <p className={styles.readOnlyText}>{form.receivedFrom}</p>
                ) : (
                  <input
                    type="text"
                    name="receivedFrom"
                    value={form.receivedFrom}
                    onChange={handleChange}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Sent To:</label>
                {mode === "view" ? (
                  <p className={styles.readOnlyText}>{form.sentTo}</p>
                ) : (
                  <input
                    type="text"
                    name="sentTo"
                    value={form.sentTo}
                    onChange={handleChange}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Date:</label>
                {mode === "view" ? (
                  <p className={styles.readOnlyText}>{form.date}</p>
                ) : (
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              {mode != "view" && <button onClick={onClose} className={styles.cancelButton}>Close</button>}
              {mode === "edit" && <button onClick={handleSubmit} className={styles.submitButton}>Update</button>}
              {mode === "view" && <button onClick={onClose} className={styles.submitButton}>OK</button>}
              {mode === "create" && <button onClick={handleSubmit} className={styles.submitButton}>Create</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogModal;
