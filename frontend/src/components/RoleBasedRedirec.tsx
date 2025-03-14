import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";

const RoleBasedRedirect: React.FC = () => {
  const { role } = useAuth();

  if (role && role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  } else if (role && role === "student") {
    return <Navigate to="/studentdashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default RoleBasedRedirect;