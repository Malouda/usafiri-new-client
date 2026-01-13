import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store";

interface RequireAuthProps {
  requiredRoles?: string[];
}

const RequireAuth = ({ children, requiredRoles = [] }: PropsWithChildren<RequireAuthProps>) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
