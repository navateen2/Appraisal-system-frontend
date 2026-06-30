
import { Suspense, useState } from "react"
import "./page.css"
import { Outlet } from "react-router"
// import { RouterProvider } from "react-router/dom"
import Error from "../Error"
import { useNavigate } from "react-router"


function Page() {
    const Navigate = useNavigate()
    const token = localStorage.getItem("token") || "";
    let userName = "Guest";
    let userRole = "";
    
    try {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            userName = payload.email ? payload.email.split("@")[0] : "User";
            userRole = payload.role || "";
        }
    } catch (e) {
        userName = localStorage.getItem("userEmail")?.split("@")[0] || "User";
        userRole = localStorage.getItem("userRole") || "";
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-header-name">
                    <img src="/src/assets/TCP.svg" alt="" onClick={() => { Navigate("/") }} style={{ cursor: "pointer" }} />
                    <div className="website-name">
                        <span>TalentCycle Pro</span>
                        <span className="sub-title">HR Management</span>
                    </div>
                </div>
                <div className="navbar-user-info">
                    <img src="/src/assets/bell.svg" alt="" />
                    <div className="vdivider" />
                    <div className="user-info">
                        <span className="user-name" style={{ textTransform: "capitalize" }}>{userName}</span>
                        <span className="user-role">{userRole}</span>
                    </div>
                </div>
            </nav>
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