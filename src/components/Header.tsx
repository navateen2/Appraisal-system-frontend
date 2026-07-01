import { useNavigate } from "react-router"
import getUserIdFromToken from "../utils/getUserIDfromToken"

function Header() {
    const Navigate = useNavigate()
    const token = localStorage.getItem("token")
    if (!token) return "Not Authorized"
    const user = getUserIdFromToken(token)
    return (
        <div className="header">
            <div className="header-name">
                <img src="/src/assets/TCP.svg" alt="" onClick={() => { Navigate("/") }} />
                <div className="website-name">
                    <span>TalentCycle Pro</span>
                    <span className="sub-title">HR Management</span>
                </div>
            </div>
            <div className="header-user-info">
                <img src="/src/assets/bell.svg" alt="" />
                <div className="vdivider" />
                <div className="user-info">
                    <span className="user-name">User ID: {user?.id}</span>
                    <span className="user-role">{user?.role}</span>
                </div>

            </div>
        </div>
    )
}
export default Header