import { createBrowserRouter, Navigate } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error";
import LoginPage from "../pages/login/LoginPage";
import Cycles from "../components/Cycles";
import PageUser from "../pages/PageUser";

const router = createBrowserRouter([
  {
    path: "/login",
    element:<LoginPage />,
    errorElement: <Error />,
  },
  {
    element: <ProtectedRoute allowedRoles={["HR"]} />,
    errorElement: <Error />,
    children: [
      {
        path: "/hr",
        element: <Page />,
        children: [
          {index: true, element: <span>Dashboard</span>},
          {path: "cycles", element: <Cycles />},
          {path: "users", element: <span>Users</span>}, 
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["Employee"]} />,
    errorElement: <Error />,
    children: [
      {
        path: "/employee",
        element: <PageUser />,
        children: [
          {index: true, element: <span>Dashboard Employee</span>},
          {path: "appraisals", element: <Cycles />},
          {path: "lead_feedback", element: <span>Users</span>},
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
