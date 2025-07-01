import React, { useState } from "react";
import styles from "./newTaskForm.module.css";
import { useProjectData, useTaskData, useUserData } from "../../Store/UseContexts/UseContexts";

const NewTaskForm = ({showNewTaskForm}) => {
  const { projectsList } = useProjectData()
  const { usersList } = useUserData()

  const { createNewTask } = useTaskData()

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: null,
    dueDate: "",
    priority: "Low",
    status: "Pending",
    project: null, // full project object
  });

  const [projectInput, setProjectInput] = useState("");
  const [assignedToInput, setAssignedToInput] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleProjectInputChange = (e) => {
    const value = e.target.value;
    setProjectInput(value);

    const selectedProject = projectsList.find(
      (proj) => proj.name.toLowerCase() === value.toLowerCase()
    );

    setTaskData((prev) => ({
      ...prev,
      project: selectedProject || null,
    }));
  };



  const handleAssignedToInputChange = (e) => {
  const value = e.target.value;
  setAssignedToInput(value);

  const selectedUser = usersList.find(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase() === value.toLowerCase()
  );

  setTaskData((prev) => ({
    ...prev,
    assignedTo: selectedUser || null,
  }));
};






  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskData.project) {
      alert("Please select a valid project from the suggestions.");
      return;
    }
    // You can now send `taskData` to your backend API
    createNewTask(taskData)
    showNewTaskForm(false)

  };

  return (
    <div className={styles.container}>
      <button
            className={styles.closeNewTaskBtn}
            onClick={() => showNewTaskForm(false)}
          >
            X
      </button>
      <h2 className={styles.title}>Create Task</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.leftColumn}>
          <div className={styles.formGroup}>
            <label>Task Name</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="Enter task title or name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Assigned To</label>
            <input
              type="text"
              name="assignedToInput"
              list="assignedToSuggestions"
              value={assignedToInput}
              onChange={handleAssignedToInputChange}
              placeholder="Start typing a user name"
              required
            />
            <datalist id="assignedToSuggestions">
              {usersList.map((user) => (
                <option key={user.id} value={`${user.first_name} ${user.last_name}`} />
              ))}
            </datalist>
          </div>



          <div className={styles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="planning">Planning</option>
              <option value="on going">On Going</option>
              <option value="on hold">On Hold</option>
              <option value="Completed">Completed</option>

            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Project Name</label>
            <input
              type="text"
              name="projectInput"
              list="projectSuggestions"
              value={projectInput}
              onChange={handleProjectInputChange}
              placeholder="Start typing to see suggestions"
              required
            />
            <datalist id="projectSuggestions">
              {projectsList.map((project) => (
                <option key={project.id} value={project.name} />
              ))}
            </datalist>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default NewTaskForm;
