import { createBrowserRouter } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error"
import Cycles from "../components/Cycles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
    children: [
      {index: true, element: <span>Dashboard</span>},
      {path: "/cycles", element: <Cycles />},
      {path: "/users", element: <span>Users</span>},
    ],
    errorElement: <Error />,
  },
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       path: "/employee",
  //       element: <Layout />,
  //       children: [
  //         { index: true, element: < /> },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: "*",
  //   element: <NotFound />,
  // },
]);

export default router;
