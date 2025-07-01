import React, { useEffect, useState } from "react";
import styles from "./taskModal.module.css";
import { useProjectData, useTaskData, useUserData } from "../../Store/UseContexts/UseContexts";

const TaskModal = ({ task, mode, onClose }) => {
  const { updateTask, deleteTask } = useTaskData();
  const { projectsList } = useProjectData();
  const { usersList } = useUserData();


  const [formData, setFormData] = useState({ ...task });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(mode === "delete");

  // Normalize project and assignedTo fields
  useEffect(() => {
    if (task.project && typeof task.project === "number") {
      const matchedProject = projectsList.find((p) => p.id === task.project);
      if (matchedProject) {
        setFormData((prev) => ({ ...prev, project: matchedProject }));
      }
    }

    if (task.assignedTo && typeof task.assignedTo === "number") {
      const matchedUser = usersList.find((u) => u.id === task.assignedTo);
      if (matchedUser) {
        setFormData((prev) => ({ ...prev, assignedTo: matchedUser }));
      }
    }
  }, [projectsList, usersList, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectChange = (e) => {
    const selectedProjectId = parseInt(e.target.value);
    const selectedProject = projectsList.find((p) => p.id === selectedProjectId);
    if (selectedProject) {
      setFormData((prev) => ({ ...prev, project: selectedProject }));
    }
  };

  const handleAssignedToChange = (e) => {
    const value = e.target.value;
    const selectedUser = usersList.find(
      (user) => user.full_name.toLowerCase() === value.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedUser || value, // fallback to text if no match
    }));
  };

  const handleUpdate = () => {  
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo?.full_name,
      assignedToId:formData.assignedTo?.id,
      project: formData.projectId
    };
    updateTask(payload);
    onClose();
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteTask(task);
    onClose();
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {showDeleteConfirm ? (
          <div className={styles.confirmBox}>
            <p><strong>Project:</strong> {task.projectName }</p>
            <p><strong>Assigned To:</strong> {task.assignedTo?.first_name || task.assignedTo}</p>
            <p>Are you sure you want to delete this task?</p>
            <button onClick={confirmDelete} className={styles.confirmButton}>Confirm</button>
            <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        ) : (
          <>
            <h2 className={styles.formTitle}>
              {mode === "view" ? "Task Details" : "Edit Task"}
            </h2>
            <div className={styles.modalContent}>
              <div className={styles.formGroupContainer}>
                {/* Left Section */}
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <label>Title:</label>
                    {mode === "view" ? (
                      <p>{formData.name}</p>
                    ) : (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <label>Assigned To:</label>
                    {mode === "view" ? (
                      <p>
                        {formData.assignedTo?.first_name
                          ? `${formData.assignedTo.first_name} ${formData.assignedTo.last_name}`
                          : formData.assignedTo}
                      </p>
                    ) : (
                      <input
                        type="text"
                        name="assignedTo"
                        list="userSuggestions"
                        value={
                          typeof formData.assignedTo === "object"
                            ? `${formData.assignedTo.first_name} ${formData.assignedTo.last_name}`
                            : formData.assignedTo
                        }
                        onChange={handleAssignedToChange}
                      />
                    )}
                    <datalist id="userSuggestions">
                      {usersList.map((user) => (
                        <option
                          key={user.id}
                          value={user.full_name}
                        />
                      ))}
                    </datalist>
                  </div>

                  <div className={styles.formRow}>
                    <label>Due Date:</label>
                    {mode === "view" ? (
                      <p>{formData.dueDate}</p>
                    ) : (
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <label>Status:</label>
                    {mode === "view" ? (
                      <p>{formData.status}</p>
                    ) : (
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="planning">Planning</option>
                        <option value="on going">On Going</option>
                        <option value="on hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <label>Priority:</label>
                    {mode === "view" ? (
                      <p>{formData.priority}</p>
                    ) : (
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <label>Project:</label>
                    {mode === "view" ? (
                      <p>{formData.projectName || "N/A"}</p>
                    ) : (
                      <select
                        value={formData.project?.id || ""}
                        onChange={handleProjectChange}
                      >
                        <option value="" disabled>
                          {formData.projectName}
                        </option>
                        {projectsList.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                
                  <div className={styles.formRow}>
                    <label>Description:</label>
                    {mode === "view" ? (
                      <p>{formData.description}</p>
                    ) : (
                      <textarea 
                      className={styles.modeTextArea}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    )}
                  </div>
              </div>
            </div>

            <div className={styles.submitContainer}>
              {mode != "view" && <button onClick={onClose} className={styles.confirmButton}>Close</button>}
              {mode === "edit" && <button onClick={handleUpdate} className={styles.submitButton}>Update</button>}
              {mode === "view" && <button onClick={onClose} className={styles.submitButton}>OK</button>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
