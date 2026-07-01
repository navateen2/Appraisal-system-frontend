
import { Suspense, } from "react"
import "./page.css"
import { Outlet } from "react-router"
import Error from "../Error"
import Header from "../components/Header"
import SideBarUser from "../components/SideBarUser"


function PageUser() {
    return (

        <>
            <Header />
            <div className="main-page">
                <SideBarUser />
                <div className="main-space">
                    <Suspense fallback={<Error />}>
                        <Outlet />
                    </Suspense>

                </div>
            </div>
        </>


    )
}

export default PageUser