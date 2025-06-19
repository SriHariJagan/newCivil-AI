import React, { useState } from "react";
import styles from "./newProjectForm.module.css";
import { useProjectData } from "../../Store/UseContexts/UseContexts.jsx";


const NewProjectForm = ({setShowNewProject}) => {

  const { createNewProject } = useProjectData();

  const [formData, setFormData] = useState({
    name: "",
    sanction_date: "",
    length_km: "",
    total_project_cost: "",
    lane_configuration: "",
    contractor_name: "",
    tender_amount: "",
    completion_period_months: "",
    appointed_date: "",
    scheduled_completion_date: "",
    total_delay_days: "",
    physical_progress: "",
    financial_progress: "",
    status: "",
    state: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      length_km: parseFloat(formData.length_km),
      total_project_cost: parseFloat(formData.total_project_cost),
      tender_amount: parseFloat(formData.tender_amount),
      completion_period_months: parseInt(formData.completion_period_months),
      total_delay_days: parseInt(formData.total_delay_days),
      physical_progress: parseFloat(formData.physical_progress),
      financial_progress: parseFloat(formData.financial_progress),
    };


    createNewProject(payload)
    setShowNewProject(false)
  }





  return (
    <div className={styles.newProjectFormContainer}>
      <h2 className={styles.formTitle}>Create Project</h2>
      <form className={styles.projectForm} method="POST" onSubmit={handleSubmit}>
        <div className={styles.formGroupContainer}>
          {/* Left Column */}
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <label>Name:</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter Project Name"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Sanction Date:</label>
              <input
                name="sanction_date"
                value={formData.sanction_date}
                onChange={handleChange}
                type="date"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Length (Km):</label>
              <input
                name="length_km"
                value={formData.length_km}
                onChange={handleChange}
                type="text"
                placeholder="e.g. 4.9"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Total Project Cost (Cr):</label>
              <input
                name="total_project_cost"
                value={formData.total_project_cost}
                onChange={handleChange}
                type="text"
                placeholder="e.g. 85.53"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Contractor:</label>
              <input
                name="contractor_name"
                value={formData.contractor_name}
                onChange={handleChange}
                type="text"
                placeholder="Enter Contractor Name"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Location (State):</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                type="text"
                placeholder="Enter Location"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Lane Configuration:</label>
              <input
                name="lane_configuration"
                value={formData.lane_configuration}
                onChange={handleChange}
                type="text"
                placeholder="e.g. 4 Lane with Paved Shoulder"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Tender Amount:</label>
              <input
                name="tender_amount"
                value={formData.tender_amount}
                onChange={handleChange}
                type="text"
                placeholder="Enter Tender Amount"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Physical Progress (%):</label>
              <input
                name="physical_progress"
                value={formData.physical_progress}
                onChange={handleChange}
                type="text"
                placeholder="Enter Physical Progress"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Financial Progress (%):</label>
              <input
                name="financial_progress"
                value={formData.financial_progress}
                onChange={handleChange}
                type="text"
                placeholder="Enter Financial Progress"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <label>Completion Period (Months):</label>
              <input
                name="completion_period_months"
                value={formData.completion_period_months}
                onChange={handleChange}
                type="text"
                placeholder="Enter Completion Period"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Appointed Date:</label>
              <input
                name="appointed_date"
                value={formData.appointed_date}
                onChange={handleChange}
                type="date"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Scheduled Completion Date:</label>
              <input
                name="scheduled_completion_date"
                value={formData.scheduled_completion_date}
                onChange={handleChange}
                type="date"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Total Delay (Days):</label>
              <input
                name="total_delay_days"
                value={formData.total_delay_days}
                onChange={handleChange}
                type="text"
                placeholder="Enter Delay Days"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label htmlFor="status">Project Status:</label>
              <select
                id="status"
                name="status"
                className={styles.selectInput}
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="on going">On Going</option>
                <option value="on hold">On Hold</option>
                <option value="planning">Planning</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>
            Create Project
          </button>
        </div>
      </form>
    </div>
  );

  
};

export default NewProjectForm;
