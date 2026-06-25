import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="px-4 py-6">
      <div className="mx-auto max-w-screen-2xl px-4 py-2 md:px-6 md:py-4 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
