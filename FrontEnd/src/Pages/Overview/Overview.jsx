import React, { useState } from "react";
import styles from "./overview.module.css";
import filterData from "../../Utils/filterData";
import { useOverviewData } from "../../Store/UseContexts/UseContexts";
import { Link } from "react-router-dom";


const Overview = () => {
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { projectData, taskData } = useOverviewData()

  const filteredProjects = filterData(projectData, searchTerm);
  const filteredTasks = filterData(taskData, searchTerm);

  return (
    <div className={styles.container}>
      {/* Projects Section */}
      <div className={styles.section}>
        <div
          className={styles.header}
          onClick={() => {
            setIsProjectOpen(!isProjectOpen);
            setIsTaskOpen(false);
          }}
        >
          <h2><Link to = "/projects" className={styles.titleLink}>Projects</Link></h2>
          <button className={styles.toggleBtn}>
            {isProjectOpen ? "Hide" : "Show"}
          </button>
        </div>
        {isProjectOpen && (
          <div className={styles.content}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.dataContainer}>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((item, index) => (
                  <div key={index} className={styles.dataCard}>
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noResults}>No results found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className={styles.section}>
        <div
          className={styles.header}
          onClick={() => {
            setIsTaskOpen(!isTaskOpen);
            setIsProjectOpen(false);
          }}
        >
          <h2><Link to='/tasks' className={styles.titleLink}>Tasks</Link></h2>
          <button className={styles.toggleBtn}>
            {isTaskOpen ? "Hide" : "Show"}
          </button>
        </div>
        {isTaskOpen && (
          <div className={styles.content}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search Tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.dataContainer}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((item, index) => (
                  <div key={index} className={styles.dataCard}>
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noResults}>No results found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
