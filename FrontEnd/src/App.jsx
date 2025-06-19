import React, { useEffect, useState, Suspense, lazy } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Lazy load pages and components
const Login = lazy(() => import("./Pages/LoginPage/LoginPage"));
const Header = lazy(() => import("./Pages/Header/Header"));
const Overview = lazy(() => import("./Pages/Overview/Overview"));
const Projects = lazy(() => import("./Pages/Projects/Projects"));
const Task = lazy(() => import("./Pages/Task/Task"));
const User = lazy(() => import("./Pages/User/User"));
const Chat = lazy(() => import("./Pages/Chat/Chat"));
const Details = lazy(() => import("./Components/Details/Details"));
const ProtectedRoute = lazy(() => import("./Components/ProtectedRoute"));
const ChangePassword = lazy(() => import("./Pages/ChangePassword/ChangePassword"));
const AdminProfile = lazy(() => import("./Pages/AdminProfile/AdminProfile"));

import chartIcon from "/Images/chat.png";
import isTokenValid from "./Utils/isTokenValid";
import { HashLoader } from "react-spinners";

// Loading fallback component
const LoadingScreen = () => (
  <div className="loading-screen">
    <HashLoader color="#80f8da" />
    <p>Loading, please wait...</p>
  </div>
);

const App = () => {
  const [searchData, setSearchData] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const goToChat = () => {
    if (location.pathname !== "/chat") {
      navigate("/chat");
    }
  };

  const getDetails = (data) => {
    setSearchData(data);
    console.log(data);
  };

  useEffect(() => {
    const tokenStatus = isTokenValid();
    setIsAuthorized(tokenStatus);

    if (!tokenStatus && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const showHeader = isAuthorized && location.pathname !== "/login";
  const showChatButton = isAuthorized && location.pathname !== "/chat" && location.pathname !== "/login";

  return (
    <div className="appContainer">
      {/* Header if not on login page */}
      {showHeader && <Header getData={getDetails} />}

      {/* Suspense fallback for all lazy-loaded routes */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Task /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/details" element={<ProtectedRoute><Details data={searchData} /></ProtectedRoute>} />
          <Route path="/change_password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/admin_Profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>

      {/* Chat button */}
      {showChatButton && (
        <button className="chartBtn" onClick={goToChat}>
          <img src={chartIcon} alt="chartIcon" />
        </button>
      )}
    </div>
  );
};

export default App;
