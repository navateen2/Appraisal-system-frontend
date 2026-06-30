function sideBarHR() {
    return (
        <div className="side-bar">
            <SideBarHRItems name="Dashboard" icon="/src/assets/dashboard.svg" link="/dashboard" />
            <SideBarHRItems name="Appraisal Cycles" icon="/src/assets/calendar.svg" link="/appraisal" />
            <SideBarHRItems name="Users" icon="/src/assets/user.svg" link="/appraisal" />


        </div>
    )
}


function ifSelectedReturnClassName(link: string) {
    if (window.location.href.includes(link)) {
        return "side-bar-item side-bar-item-selected"
    }
    return "side-bar-item"
}

function SideBarHRItems({name,icon,link}:{name: string, icon: string, link: string}) {
    return (
        <div className={ifSelectedReturnClassName(link)} onClick={() => { window.location.href = link }}>
            <img src={icon} alt="" />
            <span>{name}</span>
        </div>
    )
}

export default sideBarHR;