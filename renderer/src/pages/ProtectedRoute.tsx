import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

const ProtectedRoute = () => {
  const { currentUser, sessionLoading } = useAuth();

  if (sessionLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );

  if (!currentUser) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
