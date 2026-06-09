import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
