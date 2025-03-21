import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  accessRole?: string;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, accessRole }) => {
  const { isLoggedIn, user  } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (accessRole && accessRole !== user?.role ) {
    alert("Access Denied");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;