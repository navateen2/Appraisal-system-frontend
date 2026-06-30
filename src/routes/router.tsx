import { createBrowserRouter, Navigate } from "react-router";
// import Layout from "../layout/Layout";
// import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
// import LoginPage from "../pages/LoginPage";
import Page from "../pages/Page";
import Error from "../Error";
import { Provider } from "react-redux";
import store from "../store/store";
import LoginPage from "../pages/login/LoginPage";
import Cycles from "../components/Cycles";

const router = createBrowserRouter([
  {
    path: "/login",
    element:<Provider store={store}><LoginPage /></Provider>,
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
          {index: true, element: <span>Dashboard</span>},
          {path: "/cycles", element: <Cycles />},
          {path: "/users", element: <span>Users</span>},        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
