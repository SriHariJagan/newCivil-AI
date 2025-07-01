import React, { useEffect, useState } from "react";
import styles from "./task.module.css";
import TaskModal from "../../Components/TaskModal/TaskModal";
import NewTaskForm from "../../Components/NewTaskForm/NewTaskForm";

import { normalize } from "../../Utils/filterData";
import { useTaskData, useUserData } from "../../Store/UseContexts/UseContexts";
import { Link, useLocation } from "react-router-dom";
// import { images } from "../../constantData";

import { Eye, Pencil, Trash2 } from 'lucide-react';

const Task = () => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showAll, setShowAll] = useState(true);

  const { tasksList, refetchTasks } = useTaskData();
  const { usersList } = useUserData();


  const location = useLocation();
  const projectIdFromNav = location.state?.projectId;


  useEffect(() => {
    refetchTasks(); // ✅ reload data every time page loads
  }, []);

  useEffect(() => {
    if (tasksList.length > 0) {
      if (projectIdFromNav) {
        const filtered = tasksList.filter(
          (task) => task.projectId === projectIdFromNav
        );
        setTasks(filtered);
        setShowAll(false);
      } else {
        setTasks(tasksList);
        setShowAll(true);
      }
    } else {
      setTasks([]);
    }
    setLoading(false);
  }, [tasksList, projectIdFromNav]);

  useEffect(() => {
    if (projectIdFromNav) {
      const highlightedRow = document.querySelector(`.${styles.highlighted}`);
      if (highlightedRow) {
        highlightedRow.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [tasks, projectIdFromNav]);

  const [filters, setFilters] = useState({
    status: "",
    assignedTo: "",
    dueDate: "",
    priority: "",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const filteredTasks = tasks.filter((task) => {
    return (
      (!filters.status ||
        normalize(task.status)?.toLowerCase() === filters.status.toLowerCase()) &&
      (!filters.assignedTo ||
        task.assignedTo?.toLowerCase() === filters.assignedTo.toLowerCase()) &&
      (!filters.dueDate || task.dueDate === filters.dueDate) &&
      (!filters.priority ||
        task.priority?.toLowerCase() === filters.priority.toLowerCase())
    );
  });

  const handleOpenModal = (task, mode) => {
    setSelectedTask(task);
    setModalMode(mode);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <p>Loading Tasks....</p>;
  }

  return (
    <>
      {showNewTaskForm && (
        <div className={styles.addTaskContainer}>
          <NewTaskForm showNewTaskForm={setShowNewTaskForm} />
        </div>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          mode={modalMode}
          onClose={handleCloseModal}
        />
      )}

      <div className={styles.taskContainer}>
        <div className={styles.filter}>
          <div className={styles.filterSection}>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Filter by Status</option>
              <option value="planning">Planning</option>
              <option value="ongoing">On Going</option>
              <option value="onhold">On Hold</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={filters.assignedTo}
              onChange={(e) =>
                setFilters({ ...filters, assignedTo: e.target.value })
              }
            >
              <option value="">Filter by Person</option>
              {usersList.map((user) => (
                <option key={user.id} value={user.full_name}>
                  {user.full_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.dueDate}
              onChange={(e) =>
                setFilters({ ...filters, dueDate: e.target.value })
              }
            />

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">Filter by Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <button
              className={styles.clearBtn}
              onClick={() =>
                setFilters({
                  status: "",
                  assignedTo: "",
                  dueDate: "",
                  priority: "",
                })
              }
            >
              Clear Filters
            </button>

            {!showAll && (
              <button
                className={styles.showAllBtn}
                onClick={() => {
                  setTasks(tasksList);
                  setShowAll(true);
                  window.history.replaceState({}, document.title);
                }}
              >
                Show All Tasks
              </button>
            )}
          </div>

          <button
            className={styles.addTaskBtn}
            onClick={() => setShowNewTaskForm(true)}
          >
            + Task
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.taskTable}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Task</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectIdFromNav && tasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noTaskFound}>
                    No tasks found for this project.
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noTaskFound}>
                    No Tasks Found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>

                    <td title={task.name}>
                      {task.name.length > 50
                        ? task.name.slice(0, 50) + "..."
                        : task.name}
                    </td>

                    <td
                      className={styles.truncatedDescription}
                      title={task.description}
                    >
                      {task.description.length > 100
                        ? task.description.slice(0, 100) + "..."
                        : task.description}
                    </td>

                    
                        <td title={task.assignedTo}>
                          <Link to='/users' state = {{asignedUser: task.assignedTo}} className={styles.userName}>
                          {task.assignedTo?.length > 25
                            ? task.assignedTo.slice(0, 25) + "..."
                            : task.assignedTo}
                            </Link>
                        </td>
                    

                    <td>{task.dueDate}</td>

                    <td
                      className={`${styles.status} ${
                        styles[normalize(task.status)]
                      }`}
                    >
                      {task.status}
                    </td>

                    <td>{task.priority}</td>

                    <td title={task.projectName}>
                      {task.projectName?.length > 30
                        ? task.projectName.slice(0, 30) + "..."
                        : task.projectName}
                    </td>

                    <td className={styles.editBtns}>
                      <button
                        className={styles.view}
                        onClick={() => handleOpenModal(task, "view")}
                      >
                        <span className="icon eye-icon"><Eye size={25} /></span>
                        {/* <i className="fa-solid fa-eye" /> */}
                      </button>
                      <button
                        className={styles.edit}
                        onClick={() => handleOpenModal(task, "edit")}
                      >
                        <span className="icon pencil-icon"><Pencil size={25} /></span>
                        {/* <img src={images.editIcon} width={20} alt="edit" /> */}
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => handleOpenModal(task, "delete")}
                      >
                        <span className="icon trash-icon"><Trash2 size={25} /></span>
                        {/* <img src={images.deleteicon} width={20} alt="delete" /> */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Task;
