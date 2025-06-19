import React, { useState } from "react";
import styles from "./projectModal.module.css";

import { useProjectData } from "../../Store/UseContexts/UseContexts.jsx";

const ProjectModal = ({ project, mode, onClose, onDelete }) => {
  
  const [formData, setFormData] = useState({
  id: project.id,
  name: project.name || "",
  sanctionDate: project.sanctionDate || "",
  length: project.length || "",
  totalCost: project.totalCost || "",
  contractor: project.contractor || "",
  location: project.location || "",
  completionPeriod: project.completionPeriod || "",
  appointedDate: project.appointedDate || "",
  scheduledCompletionDate: project.scheduledCompletionDate || "",
  totalDelay: project.totalDelay || "",
  laneConfiguration: project.laneConfiguration || "",
  tenderAmount: project.tenderAmount || "",
  physicalProgress: project.physicalProgress || "",
  financialProgress: project.financialProgress || "",
  status: project.status || "",
});


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(mode === "delete");
  const { deleteProject, updateProject } = useProjectData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    updateProject(formData);
    onClose();
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteProject(project);
    onDelete();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {showDeleteConfirm ? (
          <div className={styles.confirmBox}>
            <h3>{project.name}</h3>
            <p>
              <strong>Contractor:</strong> {project.contractor} Pvt Ltd
            </p>
            <p>Are you sure you want to delete this project?</p>
            <div className={styles.confirmButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}>Delete</button>
              <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>{mode === "view" ? "Project Details" : "Edit Project"}</h2>

            <div className={styles.modalContent}>
              <div className={styles.formGroupContainer}>
                {/* LEFT COLUMN */}
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Sanction Date:</label>
                    <input type="date" name="sanctionDate" value={formData.sanctionDate} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Length (km):</label>
                    <input type="text" name="length" value={formData.length} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Total Project Cost:</label>
                    <input type="text" name="totalCost" value={formData.totalCost} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Contractor:</label>
                    <input type="text" name="contractor" value={formData.contractor} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Total Delay (Days):</label>
                    <input type="text" name="totalDelay" value={formData.totalDelay} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Lane Configuration:</label>
                    <input type="text" name="laneConfiguration" value={formData.laneConfiguration} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Tender Amount:</label>
                    <input type="text" name="tenderAmount" value={formData.tenderAmount} onChange={handleChange} readOnly={mode === "view"} />
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <label>Completion Period (Months):</label>
                    <input type="text" name="completionPeriod" value={formData.completionPeriod} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Appointed Date:</label>
                    <input type="date" name="appointedDate" value={formData.appointedDate} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Scheduled Completion Date:</label>
                    <input type="date" name="scheduledCompletionDate" value={formData.scheduledCompletionDate} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                
                  <div className={styles.formRow}>
                    <label>Physical Progress (%):</label>
                    <input type="text" name="physicalProgress" value={formData.physicalProgress} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Financial Progress (%):</label>
                    <input type="text" name="financialProgress" value={formData.financialProgress} onChange={handleChange} readOnly={mode === "view"} />
                  </div>
                  <div className={styles.formRow}>
                    <label>Project Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} disabled={mode === "view"}>
                      <option value="">Select Status</option>
                      <option value="planning">Planning</option>
                      <option value="on going">On Going</option>
                      <option value="on hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button onClick={onClose} className={styles.submitButton}>Close</button>
              {mode === "edit" && <button onClick={handleUpdate} className={styles.submitButton}>Update</button>}
              {mode === "view" && <button onClick={onClose} className={styles.submitButton}>OK</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
