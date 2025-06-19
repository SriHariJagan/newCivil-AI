import React, { useState, useEffect } from "react";
import styles from "./projects.module.css";

import NewProjectForm from "../../Components/NewProjectForm/NewProjectForm";
import ProjectModal from "../../Components/ProjectModal/ProjectModal";

import { Link } from "react-router-dom";
import { normalize } from "../../Utils/filterData";
import { useProjectData } from "../../Store/UseContexts/UseContexts";

import { images } from "../../constantData";

const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [loading, setLoading] = useState(true);

  const { projectsList } = useProjectData();

  useEffect(() => {
    if (projectsList.length > 0) {
      setAllProjects(projectsList);
    } else {
      setAllProjects([]);
    }
    setLoading(false);
  }, [projectsList]);

  const statusLabels = {
    all: "All",
    planning: "Planning",
    ongoing: "On Going",
    onhold: "On Hold",
    completed: "Completed",
  };

  const handleCreateProject = () => {
    setShowNewProject(true);
  };

  const handleFilterChange = (status) => {
    if (status === "all") {
      setSelectedFilters(["all"]);
    } else {
      let updatedFilters = [...selectedFilters];
      if (updatedFilters.includes(status)) {
        updatedFilters = updatedFilters.filter((item) => item !== status);
      } else {
        updatedFilters.push(status);
      }
      if (updatedFilters.length === 0) {
        updatedFilters = ["all"];
      } else {
        updatedFilters = updatedFilters.filter((item) => item !== "all");
      }
      setSelectedFilters(updatedFilters);
    }
  };

  const filteredProjects = allProjects.filter((project) =>
    selectedFilters.includes("all")
      ? true
      : selectedFilters.includes(normalize(project.status))
  );

  const renderStatusMessage = () => {
    if (selectedFilters.includes("all")) return "No projects found";
    const friendlyNames = selectedFilters
      .map((key) => statusLabels[key] || key)
      .join(", ");
    return `Project with status '${friendlyNames}' not found`;
  };

  return (
    <>
      {loading ? (
        <div className={styles.loading}>Loading projects...</div>
      ) : (
        <>
          {showNewProject && (
            <div className={styles.newProject}>
              <button
                className={styles.closeNewProjectBtn}
                onClick={() => setShowNewProject(false)}
              >
                X
              </button>
              <NewProjectForm setShowNewProject={setShowNewProject} />
            </div>
          )}

          {modalData && (
            <ProjectModal
              project={modalData}
              mode={modalMode}
              onClose={() => setModalData(null)}
              onDelete={() => setModalData(null)}
            />
          )}

          <div className={styles.homeContainer}>
            <div className={styles.homeHeader}>
              <div className={styles.filterContainer}>
                {Object.keys(statusLabels).map((statusKey) => (
                  <label key={statusKey}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(statusKey)}
                      onChange={() => handleFilterChange(statusKey)}
                    />
                    <span className={styles.status}>
                      {statusLabels[statusKey]}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className={styles.createProject}
                onClick={handleCreateProject}
              >
                + Project
              </button>
            </div>

            <div className={styles.projectTableContainer}>
              <table className={styles.projectTable}>
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>PROJECT</th>
                    <th>SANCTION DATE</th>
                    <th>LENGTH</th>
                    <th>COST</th>
                    <th>PROGRESS</th>
                    <th>CONTRACTOR</th>
                    <th>DUE DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan="10" className={styles.noData}>
                        {renderStatusMessage()}
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project, index) => (
                      <tr key={project.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link to="/tasks" state={{ projectId: project.id }} className={styles.projectName}>
                            {project.name}
                          </Link>
                        </td>
                        <td>{project.sanctionDate}</td>
                        <td className={styles.length}>{project.length}</td>
                        <td className={styles.cost}>{project.tenderAmount}</td>
                        <td className={styles.progress}>
                          {project.physicalProgress}
                        </td>
                        <td className={styles.contractor}>
                          {project.contractor}
                        </td>
                        <td>{project.scheduledCompletionDate}</td>
                        <td
                          className={`${styles.status} ${
                            styles[normalize(project.status)]
                          }`}
                        >
                          {project.status}
                        </td>
                        <td className={styles.actions}>
                          <button
                            className={`${styles.actionLink} ${styles.view}`}
                            onClick={() => {
                              setModalData(project);
                              setModalMode("view");
                            }}
                          >
                            <i class="fa-solid fa-eye" />
                          </button>
                          <button
                            className={`${styles.actionLink} ${styles.edit}`}
                            onClick={() => {
                              setModalData(project);
                              setModalMode("edit");
                            }}
                          >
                            <img src={images.editIcon} width={20} alt="edit" />
                          </button>
                          <button
                            className={`${styles.actionLink} ${styles.delete}`}
                            onClick={() => {
                              setModalData(project);
                              setModalMode("delete");
                            }}
                          >
                            <img src={images.deleteicon} width={20} alt="delete" />
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
      )}
    </>
  );
};

export default Projects;
