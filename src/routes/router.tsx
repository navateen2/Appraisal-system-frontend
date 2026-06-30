import { createBrowserRouter, Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Dashboard from "../pages/Dashboard";
import Error from "../Error";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <Error />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Page />,
        children: [
          { index: true, element: <Dashboard /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
