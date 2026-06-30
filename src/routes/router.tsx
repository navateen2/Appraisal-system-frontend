import { createBrowserRouter, Navigate } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error";
import LoginPage from "../pages/login/LoginPage";
import Cycles from "../components/Cycles";
import Appraisal from "../pages/appraisal/Appraisal";
import Feedback from "../pages/feedback/Feedback";

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
        path: "/",
        element: <Page />,
        children: [
          {index: true, element: <span>Dashboard</span>},
          {path: "/cycles", element: <Cycles />},
          {path: "/users", element: <span>Users</span>}, 
          {path: "/appraisals/:appraisalId", element:<Appraisal />},
          {path: "/appraisals/:appraisalId/feedback/:feedbackId", element:<Feedback />}             ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
