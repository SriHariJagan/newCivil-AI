import { useFetchData } from "../../Utils/Hooks/useFetchData";
import axios from "axios";
import { ENDPONITS } from "../../../url";
import { ProjectsContext } from "../UseContexts/UseContexts";


// Provider component
const ProjectsProvider = ({ children }) => {

    // Fetch the data from the API
    const { fetchResults, refetch } = useFetchData(ENDPONITS.projectList);

    // Map the fetched data to match the required format
  const transformedProjects = fetchResults?.results?.map(project => ({
    id: project.id,
    name: project.name,
    sanctionDate: project.sanction_date,
    length: project.length_km,
    totalCost: project.total_project_cost,
    contractor: project.contractor_name,
    location: project.state,
    completionPeriod: project.completion_period_months,
    appointedDate: project.appointed_date,
    scheduledCompletionDate: project.scheduled_completion_date,
    totalDelay: project.total_delay_days,
    laneConfiguration: project.lane_configuration,
    tenderAmount: project.tender_amount,
    physicalProgress: project.physical_progress,
    financialProgress: project.financial_progress,
    status: project.status
    })) || [];



    const createNewProject = async (data) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(ENDPONITS.projectList, data, {
                headers: {
                    Authorization: `Bearer ${token}`, // or `Token ${token}` depending on your backend
                    "Content-Type": "application/json",
                },
            });
            await refetch();
        } catch (err) {
            console.error("Error creating project:", err);
        }
      };


    const deleteProject = async (data) => {
        try {
            console.log("Deleting project:", data);
            const token = localStorage.getItem("authToken");

            await axios.delete(`${ENDPONITS.projectList}/${data.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Project deleted successfully");
            await refetch();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };


    const updateProject = async (data) => {
        try {
            const token = localStorage.getItem("authToken");
            const payload = {
                id: data.id,
                name: data.name,
                sanction_date: data.sanctionDate,
                length_km: parseFloat(data.length),
                total_project_cost: data.totalCost,
                lane_configuration: data.laneConfiguration,
                contractor_name: data.contractor,
                tender_amount: data.tenderAmount,
                completion_period_months: parseInt(data.completionPeriod),
                appointed_date: data.appointedDate,
                scheduled_completion_date: data.scheduledCompletionDate,
                total_delay_days: parseInt(data.totalDelay),
                physical_progress: parseFloat(data.physicalProgress),
                financial_progress: parseFloat(data.financialProgress),
                status: data.status,
                state: data.state ?? data.location ?? null,
            };


                await axios.put(`${ENDPONITS.projectList}/${data.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                },
            });
            await refetch(); // refresh the data if needed
        } catch (error) {
            console.error("Error updating project:", error);
        }
    }



    const value = {
        projectsList: transformedProjects,
        createNewProject,
        deleteProject,
        updateProject
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

export default ProjectsProvider;
