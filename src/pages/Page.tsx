
import { Suspense, useState } from "react"
import "./page.css"
import { Outlet } from "react-router"
// import { RouterProvider } from "react-router/dom"
import Error from "../Error"
import Header from "../components/Header"
import SideBarHR from "../components/SideBarHR"


function Page() {
    return (

        <>
            <Header />
            <div className="main-page">
                <SideBarHR />
                <div className="main-space">
                    <Suspense fallback={<Error />}>
                        <Outlet />
                    </Suspense>

                </div>
            </div>
        </>


    )
}

export default Page