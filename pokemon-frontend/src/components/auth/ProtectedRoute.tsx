import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="인증 확인중..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
