import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import Error from "../Error";


interface TokenPayload {
  id: string;
  type: string;
  role: string;
  exp: number;
}

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = jwtDecode<TokenPayload>(token);

    // If roles are specified, enforce them
    if (
      allowedRoles &&
      !allowedRoles.includes(payload.role)
    ) {
      return <Error/>;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;