import { useLocation } from "react-router";

function sideBarHR() {

    
    return (
        <div className="side-bar">
            <SideBarHRItems name="Dashboard" icon="/src/assets/dashboard.svg" link="/hr/dashboard" />
            <SideBarHRItems name="Appraisal Cycles" icon="/src/assets/calendar.svg" link="/hr/cycles" />
            <SideBarHRItems name="Users" icon="/src/assets/user.svg" link="/hr/users" />


        </div>
    )
}


function ifSelectedReturnClassName(link: string, location: string) {
    if (location.includes(link) && !(link === "/hr" &&location !== "/hr")) {
        return "side-bar-item side-bar-item-selected"
    }
    return "side-bar-item"
}

function SideBarHRItems({name,icon,link}:{name: string, icon: string, link: string}) {
    const location = useLocation();
    return (
        <div className={ifSelectedReturnClassName(link,location.pathname)} onClick={() => { window.location.href = link }}>
            <img src={icon} alt="" />
            <span>{name}</span>
        </div>
    )
}

export default sideBarHR;