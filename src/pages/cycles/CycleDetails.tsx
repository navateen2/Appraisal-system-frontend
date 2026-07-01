import { useNavigate } from "react-router";
import "./cycledetails.css";

function CycleDetails() {
  return (
    <div className="cycle-details">
      <div className="cycle-details-header">
        <div className="cycle-details-header-left">
          <div className="cycle-details-header-info">
            {getDateRange()}
            {getStatus()}
          </div>
          <span className="cycle-details-header-title">Developer Cycle</span>
        </div>
        <MarkCycleCompleteButton />
        <StartCycleButton />
      </div>
      <div className="Appraisals-table">
        <div className="cycles-row column-names">
          <span className="column-id">ID</span>
          <span className="column-id">EMPLOYEE ID</span>
          <span className="column-name">EMPLOYEE NAME</span>
          <span className="column-status">STATUS</span>
        </div>
        <AppraisalRow id="2" emp_id="EMP002" name="John Doe" status="COMPLETED" />
        <AppraisalRow id="1" emp_id="EMP001" name="John Doe" status="IN PROGRESS" />
        <AppraisalRow id="3" emp_id="EMP003" name="John Doe" status="INITIATED" />
      </div>
    </div>
  );
}

export default CycleDetails;

const getDateRange = () => {
  return (
    <div className="status-badge">
      Date Range
    </div>
  )
}

const getStatus = () => {
  return (
    <div className="status-badge status-completed">
      Status: Completed
    </div>
  )
}

function AppraisalRow({ id, emp_id, name, status }: { id: string, emp_id: string, name: string, status: string }) {
  const navigate = useNavigate();
  return (
    <div className="cycles-row" onClick={() => navigate(`/cycles/${id}`)}>
      <span className="column-id">{id}</span>
      <span className="column-id">{emp_id}</span>
      <span className="column-name">{name}</span>
      <span className="column-status">
        <StatusBadge status={status} />
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusClass: any = {
    "IN PROGRESS": "status-in-progress",
    "COMPLETED": "status-completed",
    "INITIATED": "status-initiated",
  }
  return (
    <span className={`status-badge ${statusClass[status]}`}> {status} </span>
  )
}

function MarkCycleCompleteButton() {
  return (
    <button className="mark-cycle-complete-button">
      Mark Cycle Complete
    </button>
  )
}

function StartCycleButton() {
  return (
    <button className="start-cycle-button" >
      Start Cycle
    </button>
  )
}