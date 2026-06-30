import { createBrowserRouter } from "react-router";

// import LoginPage from "./LoginPage";
import Error from "./Error";
import { Navigate } from "react-router";





import React from "react";
import Page from "./Page";
// import EditEmployeeArea from "./EditEmployee";
// const Page = React.lazy(() => import("./Page"))


function PrivateRoute(props:{children:React.ReactNode}){
    const token =localStorage.getItem("token")
    if(token){
        return(props.children)
    }
    else{
        return(
        <Navigate to="/login"/>
        )
    }

} 

const router = createBrowserRouter([
    // {
    //     path: "/",
    //     element: <Navigate to="/"/>
    // },
    // {
    //     path: "/login",
    //     element: <LoginPage />
    // },
    {
        path: "/",
        element: (<PrivateRoute><Page /></PrivateRoute>),
        children: [
            {index:true,element:<span>landing page</span>},
            // {path: "create", element: <FormArea /> },
            // {path: "details/:id" , element: <EmployeeDetails/>},
            // {path: "edit/:id" , element: <EditEmployeeArea/>}
        ]
    },
    {
        path: "*",
        element: <Error />
    }

])

export default router;