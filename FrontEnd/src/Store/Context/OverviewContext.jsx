import { ENDPONITS } from "../../../url";
import { useFetchData } from "../../Utils/Hooks/useFetchData";
import { OverviewContext } from "../UseContexts/UseContexts";

const OverviewProvider = ({ children }) => {
  const { fetchResults, refetch } = useFetchData(ENDPONITS.overViewList);

  const transformData = (data) => {
    const projectStats = data?.projects || {};
    const taskStats = data?.tasks || {};

    const projectData = [
      { title: "Total Projects", value: String(projectStats.total || 0) },
      { title: "New Projects", value: String(projectStats.new || 0) },
      { title: "On Going", value: String(projectStats.ongoing || 0) },
      { title: "On Hold", value: String(projectStats.on_hold || 0) },
      { title: "Completed", value: String(projectStats.completed || 0) },
    ];

    const taskData = [
      { title: "Total Tasks", value: String(taskStats.total || 0) },
      { title: "New Tasks", value: String(taskStats.new || 0) },
      { title: "On Going", value: String(taskStats.ongoing || 0) },
      { title: "On Hold", value: String(taskStats.on_hold || 0) },
      { title: "Completed", value: String(taskStats.completed || 0) },
    ];

    return { projectData, taskData };
  };

  const { projectData, taskData } = transformData(fetchResults?.results);

  const value = {
    projectData,
    taskData,
    refetchOverview: refetch,
  };

  return (
    <OverviewContext.Provider value={value}>
      {children}
    </OverviewContext.Provider>
  );
};

export default OverviewProvider;
