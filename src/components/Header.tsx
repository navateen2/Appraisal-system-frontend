import { useNavigate } from "react-router"
import getUserIdFromToken from "../utils/getUserIDfromToken"
import { useGetUserByIdQuery } from "../api_service/employees/employee.api"
import { LogOut } from "lucide-react"

function Header() {
    const Navigate = useNavigate()
    const token = localStorage.getItem("token")
    if (!token) return "Not Authorized"
    const user = getUserIdFromToken(token)
    const getUserdetails = useGetUserByIdQuery(Number(user?.id))
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
                <div className="user-info">
                    <span className="user-name">{getUserdetails.data?.name}</span>
                    <span className="user-role">{user?.role}</span>
                </div>
                <div className="vdivider" />
                <LogOut onClick={()=>{
                    localStorage.clear()
                    Navigate("/login")
                }
            }/>


            </div>
        </div>
    )
}
export default Header