import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles?: Array<"manager" | "operator" | "project_manager">;
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth to load
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
