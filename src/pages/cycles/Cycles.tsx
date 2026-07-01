import { useNavigate } from "react-router";
import "./cycles.css";
import { useGetCyclesQuery } from "../../api_service/cycle/cycle.api";

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
                
                {useGetCyclesQuery().isLoading && <div>Loading...</div>}
                {useGetCyclesQuery().data?.map((cycle: any) => (
                <CyclesRow
                    key={cycle.id}
                    id={cycle.id}
                    name={cycle.name}
                    dateRange={cycle.start_date.substring(0, 10) + " - " + cycle.end_date.substring(0, 10)}
                    status={cycle.status}
                />
                ))}
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
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "Initiated": "status-initiated",
    }
    return (
        <span className={`status-badge ${statusClass[status]}`}> {status} </span>
    )
}

export default Cycles;
