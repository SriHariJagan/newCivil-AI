// src/Components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import isTokenValid from "../Utils/isTokenValid"; // Adjust path as needed

const ProtectedRoute = ({ children }) => {
  const valid = isTokenValid();

  return valid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
