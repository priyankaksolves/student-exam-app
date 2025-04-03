import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role ?? "")) {
    useEffect(() => {
      toast.warning("Access Denied");
      navigate("/", { replace: true });
    }, []);
    
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
