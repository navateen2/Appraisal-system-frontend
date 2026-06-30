import { useNavigate } from "react-router";
import "./cycles.css";

function Cycles() {
    return (
        <div className="cycles-page">
            <div className="cycles-header">
                <div className="cycles-header-text">
                    <span className="cycles-header-title">Appraisal Cycles</span>
                    <span className="cycles-header-subtitle">Manage Cycles</span>
                </div>
                
                <button className="cycles-header-button">
                    <img src="/src/assets/add.svg" alt="" />
                    New Appraisal Cycle
                </button>
            </div>
            <div className="cycles-table">
                <div className="cycles-row column-names">
                    <span className="column-id">ID</span>
                    <span className="column-name">CYCLE NAME</span>
                    <span className="column-daterange">DATE RANGE</span>
                    <span className="column-status">STATUS</span>
                </div>
                <CyclesRow id="1" name="Cycle 1" dateRange="01/01/2023 - 31/01/2023" status="IN PROGRESS" />
                <CyclesRow id="2" name="Cycle 2" dateRange="01/02/2023 - 28/02/2023" status="COMPLETED" />
                <CyclesRow id="3" name="Cycle 3" dateRange="01/03/2023 - 31/03/2023" status="INITIATED" />
            </div>
            
        </div>
    )
}

function CyclesRow({id, name, dateRange, status}:{id: string, name: string, dateRange: string, status: string}) {
    const navigate = useNavigate();
    return (
        <div className="cycles-row" onClick={() => navigate(`/cycles/${id}`)}>
            <span className="column-id">{id}</span>
            <span className="column-name">{name}</span>
            <span className="column-daterange">{dateRange}</span>
            <span className="column-status">
                <StatusBadge status={status} />
            </span>
        </div>
    )
}

function StatusBadge({status}:{status: string}) {
    const statusClass:any = {
        "IN PROGRESS": "status-in-progress",
        "COMPLETED": "status-completed",
        "INITIATED": "status-initiated",
    }
    return (
        <span className={`status-badge ${statusClass[status]}`}> {status} </span>
    )
}

export default Cycles;
