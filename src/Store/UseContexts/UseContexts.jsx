import { createContext, useContext } from "react";


//------------- Auth Context--------------
export const AuthContext = createContext();

export const useAuthData = () => {
  return useContext(AuthContext);
};





//---------- Project Context--------------------
// Create context
export const ProjectsContext = createContext();

export const useProjectData = () => {
    return useContext(ProjectsContext);
};
// ----------------------------------------------




//--------------- Task Context ---------------------
export const TaskContext = createContext();

export const useTaskData = () => {
    return useContext(TaskContext)
}
// ---------------------------------------------------





//---------------- User Context ----------------------
export const UserContext = createContext()

export const useUserData = () => {
    return useContext(UserContext)
}




//------------------- OverView Context------------------
export const OverviewContext = createContext()

export const useOverviewData = () => {
    return useContext(OverviewContext)
}

