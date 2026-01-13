import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store";

const AuthRedirect = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthRedirect;
