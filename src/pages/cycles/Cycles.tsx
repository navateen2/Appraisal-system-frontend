import { useNavigate } from "react-router";
import "./cycles.css";
import { useGetCyclesQuery } from "../../api_service/cycle/cycle.api";
import { useState } from "react";

function Cycles() {
    const [createFormVisible,setCreateFormVisible] = useState(false);
    return (
        <div className="cycles-page">
            {createFormVisible && <CreateCycle fn={setCreateFormVisible} />}
            <div className="cycles-header">
                <div className="cycles-header-text">
                    <span className="cycles-header-title">Appraisal Cycles</span>
                    <span className="cycles-header-subtitle">Manage Cycles</span>
                </div>

                <button className="cycles-header-button" onClick={() => setCreateFormVisible(true)}>
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

function CyclesRow({ id, name, dateRange, status }: { id: string, name: string, dateRange: string, status: string }) {
    const navigate = useNavigate();
    return (
        <div className="cycles-row" onClick={() => navigate(`/hr/cycles/${id}`)}>
            <span className="column-id">{id}</span>
            <span className="column-name">{name}</span>
            <span className="column-daterange">{dateRange}</span>
            <span className="column-status">
                <StatusBadge status={status} />
            </span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const statusClass: any = {
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "Initiated": "status-initiated",
    }
    return (
        <span className={`status-badge ${statusClass[status]}`}> {status} </span>
    )
}

export default Cycles;


function CreateCycle({fn}:{fn: (arg0: boolean) => void}) {
    return (
        <div className="overlay">
            <div className="create-cycle-form">
                <div className="create-cycle-form-header">
                    <span className="create-cycle-form-title">Create Appraisal Cycle</span>
                    <img src="/src/assets/close.svg" alt="" className="create-cycle-form-close" />
                </div>
                <div className="create-cycle-form-body">
                    <span className="create-cycle-form-label">CYCLE DETAILS</span>
                    <div className="form-pair">
                        <span className="form-pair-name">Cycle Name</span>
                        <input type="text" className="form-pair-input" />
                    </div>
                    <div className="date-pair">
                        <div className="form-pair">
                            <span className="form-pair-name">Start Date</span>
                            <input type="date" className="form-pair-input" />
                        </div>
                        <div className="form-pair">
                            <span className="form-pair-name">End Date</span>
                            <input type="date" className="form-pair-input" />
                        </div>
                    </div>
                    <span className="create-cycle-form-label">ADD EMPLOYEES</span>
                    <div className="form-pair">
                        <input type="text" className="form-pair-input" placeholder="Search Employees" />
                    </div>
                    <div className="form-pair-input">
                        {

                        }
                    </div>
                </div>
                <div className="create-cycle-form-footer">
                    <button className="create-cycle-form-cancel" onClick={() => fn(false)}>
                        Cancel
                    </button>
                    <button className="create-cycle-form-submit">Create Cycle</button>
                </div>
            </div>
        </div>
    )
}

