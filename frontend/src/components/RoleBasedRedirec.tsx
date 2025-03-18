import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  } else if (user?.role === "student") {
    return <Navigate to="/studentdashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default RoleBasedRedirect;