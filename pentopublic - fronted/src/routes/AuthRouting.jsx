import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";


const AuthRouting = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but not authorized for the route
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default AuthRouting;
