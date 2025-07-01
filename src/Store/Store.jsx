import AuthProvider from "./Context/AuthContext";
import OverviewProvider from "./Context/OverviewContext";
import ProjectsProvider from "./Context/ProjectsContext"
import TaskProvider from "./Context/TasksContext";
import UserProvider from "./Context/UsersContext";

const ContextStore = ({children}) => {
    return (
        <AuthProvider>
            <ProjectsProvider>
                <TaskProvider>
                    <UserProvider>
                        <OverviewProvider>
                            {children}
                        </OverviewProvider>
                    </UserProvider>
                </TaskProvider>
            </ProjectsProvider>
        </AuthProvider>
    )
}

export default ContextStore;