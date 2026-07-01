import { createBrowserRouter, Navigate } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error";
import LoginPage from "../pages/login/LoginPage";
import Cycles from "../pages/cycles/Cycles";
import CycleDetails from "../pages/cycles/CycleDetails";
import PageUser from "../pages/PageUser";
import Appraisal from "../components/appraisals/SelfAppraisals";
import AppraisalList from "../components/appraisals/AppraisalList";
import SelfAppraisal from "../components/appraisals/SelfAppraisals";
import LeadFeedback from "../components/lead_feedback/LeadFeedBack";
import LeadFeedbackList from "../components/lead_feedback/LeadFeedBackList";

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
          {path: "cycles/:id", element: <CycleDetails />},
          {path: "users", element: <span>Users</span>},        ]
  },]},
  {
    element: <ProtectedRoute allowedRoles={["Employee"]} />,
    errorElement: <Error />,
    children: [
      {
        path: "/employee",
        element: <PageUser />,
        children: [
          {index: true, element: <span>Dashboard Employee</span>},
          {path: "appraisals", element: <AppraisalList />},
          {path: "appraisals/:appraisalId", element: <SelfAppraisal /> },
          {path: "lead_feedback", element: <LeadFeedbackList/>},
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
