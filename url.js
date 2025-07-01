// const BASE_URL = "http://127.0.0.1:8000/api/v1";
const BASE_URL = "http://35.208.1.192/api/v1";

export const ENDPONITS = {
    login: `${BASE_URL}/user/login`,
    projectList: `${BASE_URL}/project/list`, 
    taskList: `${BASE_URL}/project/tasks/list`, 
    usersList: `${BASE_URL}/user/list`,
    overViewList: `${BASE_URL}/project/dashboard`,
    changePassword: `${BASE_URL}/user/change-password`,
    chat: `${BASE_URL}/chat/generate`,
    forgetPassword: `${BASE_URL}/user/forgot-password`,
    resetPassword: `${BASE_URL}/user/reset-password`,
    adminProfile: `${BASE_URL}/user/profile`
}


// http://35.208.1.192/api/v1/chat/generate