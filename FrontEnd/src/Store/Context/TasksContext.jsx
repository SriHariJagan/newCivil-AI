import React from "react";
import axios from "axios";
import { useFetchData } from "../../Utils/Hooks/useFetchData";
import { ENDPONITS } from "../../../url";
import { TaskContext } from "../UseContexts/UseContexts";

const TaskProvider = ({ children }) => {
  // Fetch the data from the API
  const { fetchResults, refetch } = useFetchData(ENDPONITS.taskList);

  // Transform fetched task data
  const transformedTasks =
    fetchResults?.results?.map((task) =>({
      id: task.id,
      name: task.title,
      description: task.description,
      assignedTo: task.assigned_to?.full_name || `${task.assigned_to.first_name || ""} ${task.assigned_to.last_name || ""}`.trim() || "Unassigned",
      assignedToId: task.assigned_to?.id,
      dueDate: task.due_date,
      priority: task.priority,
      status: task.status,
      projectId: task.project,
      startDate: task.start_date ?? null, // fallback if available
      projectName: task.project_name ?? "Unknown",
    })) || [];

  // Create new task
  const createNewTask = async (taskData) => {
    try {
      const transformedData = {
        project: taskData.project?.id,
        assigned_to_id: taskData.assignedTo?.id,
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.dueDate,
        priority: taskData.priority.toLowerCase(),
        status: taskData.status.toLowerCase(),
      };


      const token = localStorage.getItem("authToken");
      await axios.post(ENDPONITS.taskList, transformedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await refetch()
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Update task
  const updateTask = async (data) => {
    try {
      const token = localStorage.getItem("authToken");

      console.log(data)

      const payload = {
        project: data.projectId,
        assigned_to_id: data.assignedToId,
        title: data.name,
        description: data.description,
        due_date: data.dueDate,
        priority: data.priority,
        status: data.status,
      };

      console.log(payload)

      await axios.put(`${ENDPONITS.taskList}/${data.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("taskcontest:", data);
      await refetch()
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (task) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${ENDPONITS.taskList}/${task?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const value = {
    tasksList: transformedTasks,
    createNewTask,
    updateTask,
    deleteTask,
    refetchTasks: refetch,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskProvider;
