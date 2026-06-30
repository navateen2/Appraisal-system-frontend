
import { Suspense, useState } from "react"
import "./page.css"
import { Outlet } from "react-router"
// import { RouterProvider } from "react-router/dom"
import Error from "../Error"
import Header from "../components/Header"


function Page() {
    return (

        <>
            <Header />
            <div className="main-page">
                {/* <SideBar /> */}
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