import { useNavigate, useParams } from "react-router";
import "./cycledetails.css";
import { useGetCycleByIdQuery, useGetAppraisalsByCycleIdQuery, useUpdateCycleStatusMutation } from "../../api_service/cycle/cycle.api";

function CycleDetails() {
  const { id } = useParams()
  const cycle = useGetCycleByIdQuery(id);
  const appraisals = useGetAppraisalsByCycleIdQuery(id);
  const cycleData = cycle.data;
  const [updateCycleStatus] = useUpdateCycleStatusMutation();
  console.log(cycleData);
  return (
    <div className="cycle-details">
      <div className="cycle-details-header">
        <div className="cycle-details-header-left">
          <div className="cycle-details-header-info">
            {getDateRange(cycleData?.start_date, cycleData?.end_date)}
            {getStatus(cycleData?.status)}
          </div>
          <span className="cycle-details-header-title">Developer Cycle</span>
        </div>
        {cycleData?.status === 'In Progress' && <MarkCycleCompleteButton fn={() => updateCycleStatus({ body: {status:"Completed"}, cycle_id: parseInt(id || "0") })} />}
        {cycleData?.status === 'Initiated' && <StartCycleButton fn={() => updateCycleStatus({ body: {status: "In Progress"}, cycle_id: parseInt(id || "0") })} />}
      </div>
      <div className="Appraisals-table">
        <div className="cycles-row column-names">
          <span className="column-id">APPRAISAL ID</span>
          <span className="column-id">EMPLOYEE ID</span>
          <span className="column-name">EMPLOYEE NAME</span>
          <span className="column-status">STATUS</span>
        </div>
        {appraisals.isLoading && <div>Loading...</div>}
        {appraisals.data?.map((appraisal) => (
          <AppraisalRow
            key={appraisal.id}
            id={appraisal.id.toString()}
            emp_id={appraisal.employee_id.toString()}
            name={appraisal.employee_name}
            status={appraisal.status}
          />
        ))}
      </div>
    </div>
  );
}

export default CycleDetails;

const getDateRange = (start_date?: string, end_date?: string) => {
  return (
    <div className="status-badge">
      {start_date?.substring(0,10)} to {end_date?.substring(0,10)}
    </div>
  )
}

const getStatus = (status?: string) => {
    const statusClass: any = {
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "Initiated": "status-initiated",
    }
  return (
    <div className={`status-badge ${statusClass[status]}`}>
      {status}
    </div>
  )
}

function AppraisalRow({ id, emp_id, name, status }: { id: string, emp_id: string, name: string, status: string }) {
  const navigate = useNavigate();
  return (
    <div className="cycles-row" onClick={() => navigate(`/hr/appraisals/${id}`)}>
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




function MarkCycleCompleteButton({ fn }: { fn:any }) {
  return (
    <button className="mark-cycle-complete-button" onClick={fn}>
      Mark Cycle Complete
    </button>
  )
}

function StartCycleButton({ fn }: { fn:any}) {
  return (
    <button className="start-cycle-button" onClick={fn}>
      Start Cycle
    </button>
  )
}