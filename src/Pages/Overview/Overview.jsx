import React, { useState } from "react";
import styles from "./overview.module.css";
import filterData from "../../Utils/filterData";
import { useOverviewData } from "../../Store/UseContexts/UseContexts";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#17a2b8", // New / Planning
  "#FFB22C", // Ongoing
  "#f0162c", // On Hold
  "#2dc551"  // Completed
];


const projectDetails = [
  { title: "New", value: 4 },
  { title: "Ongoing", value: 6 },
  { title: "On Hold", value: 2 },
  { title: "Completed", value: 3 }
];

const taskDetails = [
  { title: "New", value: 5 },
  { title: "Ongoing", value: 7 },
  { title: "On Hold", value: 1 },
  { title: "Completed", value: 8 }
];

const Overview = () => {
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { projectData, taskData } = useOverviewData();

  const filteredProjects = filterData(projectData, searchTerm);
  const filteredTasks = filterData(taskData, searchTerm);


  const renderPieChart = (data) => {
    if (!data || data.length === 0) return <p>No data to display</p>;
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="title"
            cx="50%"
            cy="45%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={styles.container}>
      {/* Pie Charts Section */}
      <div className={styles.pieChartSection}>
        <div className={styles.chartBox}>
          <h2 className={styles.chartTitle}>Project Status</h2>
          {renderPieChart(projectDetails)}
        </div>
        <div className={styles.chartBox}>
          <h2 className={styles.chartTitle}>Task Status</h2>
          {renderPieChart(taskDetails)}
        </div>
      </div>

      {/* Projects Section */}
      <div className={styles.section}>
        <div
          className={styles.header}
          onClick={() => {
            setIsProjectOpen(!isProjectOpen);
            setIsTaskOpen(false);
          }}
        >
          <h2>
            <Link to="/projects" className={styles.titleLink}>
              Projects
            </Link>
          </h2>
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
          <h2>
            <Link to="/tasks" className={styles.titleLink}>
              Tasks
            </Link>
          </h2>
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
