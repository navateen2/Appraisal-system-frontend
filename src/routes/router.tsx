import { createBrowserRouter } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
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
