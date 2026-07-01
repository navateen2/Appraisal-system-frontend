import { useLocation } from "react-router";

function sideBarUser() {

    
    return (
        <div className="side-bar">
            <SideBarHRItems name="Dashboard" icon="/src/assets/dashboard.svg" link="/employee" />
            <SideBarHRItems name="Appraisals" icon="/src/assets/calendar.svg" link="/employee/appraisals" />
            <SideBarHRItems name="Lead Feedback" icon="/src/assets/user.svg" link="/employee/lead_feedback" />


        </div>
    )
}


function ifSelectedReturnClassName(link: string, location: string) {
    if (link === location) {
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

export default sideBarUser;