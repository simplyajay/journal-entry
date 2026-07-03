import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = () => {
  const { currentUser, sessionLoading } = useAuth();

  if (sessionLoading)
    return <div className="h-full w-full bg-red-500">Loading...</div>;

  if (!currentUser) return <Navigate to="/login" replace />;

  return <Navigate to="/main" replace />;
};

export default ProtectedRoute;
