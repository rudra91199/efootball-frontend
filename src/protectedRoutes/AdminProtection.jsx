import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router";

export  const AdminProtection = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user?.role === "admin") {
    return <Navigate to={"/"} replace />;
  }
  return children;
};


