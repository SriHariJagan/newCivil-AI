import React from 'react';
import styles from './details.module.css';
import { useProjectData, useTaskData, useUserData } from "../../Store/UseContexts/UseContexts.jsx";

const Details = ({ data }) => {
  const { projectsList } = useProjectData();
  const { tasksList } = useTaskData();
  const { usersList } = useUserData();

  if (!data || !data.name || !data.type) {
    return <div className={styles.wrapper}>No data found.</div>;
  }

  let details = null;

  if (data.type === "Task") {
    details = tasksList.find(task => task.name === data.name);
  } else if (data.type === "Project") {
    details = projectsList.find(project => project.name === data.name);
  } else if (data.type === "User") {
    details = usersList.find(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase() === data.name.toLowerCase()
    );
  }

  if (!details) {
    return <div className={styles.wrapper}>No details available for this item.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{data.type} Details</h2>
      <div className={styles.card}>
        <div className={styles.grid}>
          {Object.entries(details).map(([key, value]) => {
            const isDescription = key.toLowerCase() === 'description';
            return (
              <div
                key={key}
                className={`${styles.detailRow} ${isDescription ? styles.fullWidth : ''}`}
              >
                <span className={styles.label}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
                </span>
                <span className={styles.value}>
                  {typeof value === 'object' && value !== null
                    ? JSON.stringify(value, null, 2)
                    : value?.toString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Details;
